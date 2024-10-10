import {
  Button,
  DialogTrigger,
  Flex,
  Icon,
  Modal,
  Image,
  Page,
  LoadingPage,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { uniqBy, orderBy } from 'lodash';
import { QrCode, SettingsIcon } from 'lucide-react';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { QRCode } from 'react-qrcode-logo';
import { useParams } from 'react-router-dom';
import { fetchPrevious, fetchUpcoming } from 'app/actions/EventActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { fetchUser } from 'app/actions/UserActions';
import frame from 'app/assets/frame.png';
import EventListCompact from 'app/components/EventListCompact';
import { ProfilePicture } from 'app/components/Image';
import { GroupType } from 'app/models';
import { useCurrentUser } from 'app/reducers/auth';
import { selectAllEvents } from 'app/reducers/events';
import { selectGroupsByType } from 'app/reducers/groups';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUserByUsername } from 'app/reducers/users';
import { EmailLists } from 'app/routes/users/components/UserProfile/EmailLists';
import { Permissions } from 'app/routes/users/components/UserProfile/Permissions';
import { ProfileSection } from 'app/routes/users/components/UserProfile/ProfileSection';
import { UserInfo } from 'app/routes/users/components/UserProfile/UserInfo';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import GroupChange from './GroupChange';
import { GroupMemberships } from './GroupMemberships';
import Penalties from './Penalties';
import PhotoConsents from './PhotoConsents';
import styles from './UserProfile.css';
import type { ListEventWithUserRegistration } from 'app/store/models/Event';
import type { PublicGroup } from 'app/store/models/Group';
import type { CurrentUser, DetailedUser } from 'app/store/models/User';
import type { ExclusifyUnion } from 'app/types';

type PermissionTreeNode = PublicGroup & {
  children: PublicGroup[];
  parent?: number;
  isMember?: boolean;
};

type PermissionTree = { [key: number]: PermissionTreeNode };

const UserProfile = () => {
  const params = useParams<{ username: string }>();
  const currentUser = useCurrentUser();
  const isCurrentUser = useIsCurrentUser(params.username);
  const username = isCurrentUser ? currentUser?.username : params.username;
  const fetching = useAppSelector((state) => state.users.fetching);
  const user = useAppSelector((state) =>
    selectUserByUsername<ExclusifyUnion<CurrentUser | DetailedUser>>(
      state,
      username,
    ),
  );

  const actionGrant = user?.actionGrant || [];
  const showSettings =
    (isCurrentUser || actionGrant.includes('edit')) && !!user?.username;

  const { pagination: upcomingEventsPagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/upcoming/',
      query: {},
    }),
  );
  const upcomingEvents = useAppSelector((state) =>
    selectAllEvents<ListEventWithUserRegistration>(state, {
      pagination: upcomingEventsPagination,
    }),
  );

  const { pagination: previousEventsPagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/previous/',
      query: {},
    }),
  );
  const previousEvents = useAppSelector((state) =>
    selectAllEvents<ListEventWithUserRegistration>(state, {
      pagination: previousEventsPagination,
    }),
  ).filter((e) => e.userReg);

  const sortedPreviousEvents = previousEvents
    ?.filter((e) => !!e.userReg?.pool)
    .filter((e) => e.userReg?.presence !== 'NOT_PRESENT')
    .sort((a, b) => (moment(a.startTime).isBefore(b.startTime) ? 1 : -1));

  const canChangeGrade = useAppSelector((state) => state.allowed.groups);
  const canEditEmailLists = useAppSelector((state) => state.allowed.email);

  const grades = useAppSelector((state) =>
    selectGroupsByType<PublicGroup>(state, GroupType.Grade),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserProfile',
    () =>
      Promise.allSettled([
        dispatch(fetchAllWithType(GroupType.Grade)),
        isCurrentUser && dispatch(fetchPrevious()),
        isCurrentUser && dispatch(fetchUpcoming()),
        dispatch(fetchUser(username)),
      ]),

    [params.username, isCurrentUser],
  );

  if (!user) {
    return <LoadingPage loading={fetching} />;
  }

  //If you wonder what this is, ask somebody
  const FRAMEID = [6050, 5962, 7276, 7434, 7747, 8493];

  const {
    pastMemberships = [],
    abakusGroups = [],
    firstName,
    lastName,
    memberships = [],
    abakusEmailLists = [],
    permissionsPerGroup = [],
    photoConsents,
  } = user;

  const allAbakusGroupsWithPerms = uniqBy(
    [
      ...permissionsPerGroup,
      ...permissionsPerGroup.flatMap(
        ({ parentPermissions }) => parentPermissions,
      ),
    ],
    (a) => a.abakusGroup.id,
  );
  const allAbakusGroups = allAbakusGroupsWithPerms.map(
    ({ abakusGroup }) => abakusGroup,
  );
  const tree: PermissionTree = {};

  for (const group of permissionsPerGroup) {
    for (const index in group.parentPermissions) {
      const parent = group.parentPermissions[index];

      if (Number(index) === 0) {
        tree[parent.abakusGroup.id] = {
          ...parent.abakusGroup,
          children: [],
          parent: null,
        };
      } else {
        tree[parent.abakusGroup.id] = {
          ...parent.abakusGroup,
          children: [],
          parent: group.parentPermissions[Number(index) - 1].abakusGroup.id,
        };
      }
    }
  }

  for (const group of permissionsPerGroup) {
    tree[group.abakusGroup.id] = {
      ...group.abakusGroup,
      children: [],
      isMember: true,
      parent: group.parentPermissions.length
        ? group.parentPermissions[group.parentPermissions.length - 1]
            .abakusGroup.id
        : null,
    };
  }

  const sum = permissionsPerGroup.reduce((roots, val) => {
    const abakusGroup = val.abakusGroup;
    const id = abakusGroup.id;
    const node = tree[id];

    if (!node.parent) {
      roots = uniqBy(roots.concat(node), (a) => a.id);
    } else {
      const parent = tree[node.parent];
      parent.children = uniqBy(parent.children.concat(node), (a) => a.id);
    }

    for (const permGroup of val.parentPermissions) {
      const abakusGroup = permGroup.abakusGroup;
      const id = abakusGroup.id;
      const node = tree[id];

      if (!node.parent) {
        roots.push(node);
        roots = uniqBy(roots.concat(node), (a) => a.id);
      } else {
        const parent = tree[node.parent];
        parent.children = uniqBy(parent.children.concat(node), (a) => a.id);
      }
    }

    return roots;
  }, [] as PermissionTreeNode[]);

  const genTree = (groups) => {
    return groups.map((group) => {
      if (group.children.length) {
        return (
          <div key={group.id}>
            {genTree([{ ...group, children: [] }])}
            <div
              style={{
                marginLeft: 10,
              }}
            >
              {genTree(group.children)}
            </div>
          </div>
        );
      }

      return (
        <div key={group.id}>
          {group.isMember ? <b> {group.name}</b> : <i> {group.name}</i>}
        </div>
      );
    });
  };

  const hasFrame = FRAMEID.includes(user.id as number);

  return (
    <Page
      title={user.fullName}
      actionButtons={
        showSettings && (
          <Icon
            iconNode={<SettingsIcon />}
            size={22}
            className={styles.settingsIcon}
            to={`/users/${user.username}/settings/profile`}
          />
        )
      }
    >
      <Helmet title={`${firstName} ${lastName}`} />

      <Flex wrap className={styles.header}>
        <Flex
          column
          alignItems="center"
          gap="var(--spacing-sm)"
          className={styles.sidebar}
        >
          <Flex alignItems="center" justifyContent="center">
            {hasFrame && (
              <Image alt="Gullramme" className={styles.frame} src={frame} />
            )}
            <ProfilePicture user={user} size={150} />
          </Flex>
          {isCurrentUser && (
            <DialogTrigger>
              <Button className={cx(hasFrame && styles.frameMargin)}>
                <Icon iconNode={<QrCode />} size={19} />
                Vis ABA-ID
              </Button>
              <Modal title="ABA-ID">
                <Flex column alignItems="center">
                  <QRCode value={user.username ?? ''} />
                  <h2>{user.username}</h2>
                </Flex>
              </Modal>
            </DialogTrigger>
          )}
          {showSettings && (
            <LinkButton href={`/users/${user.username}/settings/profile`}>
              <Icon iconNode={<SettingsIcon />} size={19} />
              Innstillinger
            </LinkButton>
          )}
        </Flex>
        <GroupMemberships
          memberships={memberships}
          pastMemberships={pastMemberships}
        />
      </Flex>

      <Flex wrap className={styles.content}>
        <div className={styles.info}>
          <UserInfo user={user} />

          {showSettings && (
            <ProfileSection title="Prikker">
              <Penalties userId={user.id} />
            </ProfileSection>
          )}
          {showSettings && photoConsents && photoConsents.length > 0 && (
            <ProfileSection title="Bildesamtykke">
              <PhotoConsents
                photoConsents={photoConsents}
                username={user.username}
                userId={user.id}
                isCurrentUser={isCurrentUser}
              />
            </ProfileSection>
          )}

          {canChangeGrade && (
            <ProfileSection title="Endre klasse">
              <GroupChange
                grades={grades}
                abakusGroups={abakusGroups}
                username={user.username}
              />
            </ProfileSection>
          )}

          {!!permissionsPerGroup.length && (
            <ProfileSection title="Grupper">
              {genTree(sum)}

              <div>
                <br />
                <i className={styles.groupExplanation}>
                  Du er medlem av gruppene markert med fet tekst, og indirekte
                  medlem av gruppene i kursiv.
                </i>
              </div>
            </ProfileSection>
          )}

          <EmailLists
            userId={user.id}
            abakusEmailLists={abakusEmailLists}
            allAbakusGroups={allAbakusGroups}
            canEditEmailLists={canEditEmailLists}
          />

          {canChangeGrade && (
            <Permissions allAbakusGroupsWithPerms={allAbakusGroupsWithPerms} />
          )}

          {isCurrentUser && user.email !== user.emailAddress && (
            <ProfileSection title="Google G Suite">
              <p>
                Din konto er linket opp mot Abakus sitt domene i Google GSuite.
                E-post sendes til denne brukeren og ikke til e-posten du har
                oppgitt i din profil.
              </p>

              <ul>
                <li>
                  <b>URL:</b> <a href="http://mail.abakus.no">mail.abakus.no</a>
                </li>
                <li>
                  <b>E-post:</b> {user.emailAddress}
                </li>
                <li>
                  <b>Passord:</b> <i>Samme som på abakus.no</i>
                </li>
              </ul>
            </ProfileSection>
          )}
        </div>
        <div className={styles.rightContent}>
          {isCurrentUser && (
            <div className={styles.bottomMargin}>
              <h3>Dine kommende arrangementer</h3>
              <EventListCompact
                events={orderBy(upcomingEvents, 'startTime')}
                noEventsMessage="Du har ingen kommende arrangementer"
                eventStyle="compact"
                loading={upcomingEventsPagination.fetching}
              />
              <h3>
                Dine tidligere arrangementer (
                {!previousEventsPagination.fetching
                  ? previousEvents === undefined
                    ? 0
                    : previousEvents.length
                  : '...'}
                )
              </h3>
              <EventListCompact
                events={sortedPreviousEvents}
                noEventsMessage="Du har ingen tidligere arrangementer"
                eventStyle="extra-compact"
                loading={previousEventsPagination.fetching}
              />
            </div>
          )}
        </div>
      </Flex>
    </Page>
  );
};

export default guardLogin(UserProfile);
