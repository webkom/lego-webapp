import cx from 'classnames';
import { sumBy, sortBy, uniqBy, groupBy, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCode } from 'react-qrcode-logo';
import { Link } from 'react-router-dom';
import frame from 'app/assets/frame.png';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import EventListCompact from 'app/components/EventListCompact';
import Icon from 'app/components/Icon';
import { ProfilePicture, CircularPicture, Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
import Pill from 'app/components/Pill';
import Tooltip from 'app/components/Tooltip';
import type {
  User,
  Group,
  AddPenalty,
  Event,
  ID,
  PhotoConsent,
  Dateish,
  Penalty,
  UserMembership,
} from 'app/models';
import { resolveGroupLink } from 'app/reducers/groups';
//import Feed from 'app/components/Feed';
import GroupChange from './GroupChange';
import Penalties from './Penalties';
import PhotoConsents from './PhotoConsents';
import styles from './UserProfile.css';

const fieldTranslations = {
  username: 'Brukernavn',
  email: 'E-post',
  internalEmailAddress: 'Abakus e-post',
};

const defaultFieldRender = (field, value) => (
  <span>
    <strong>{field}:</strong> {value}
  </span>
);

const emailFieldRender = (field, value) => (
  <span>
    <strong>{field}:</strong>
    <a href={`mailto:${value}`}> {value}</a>
  </span>
);

const fieldRenders = {
  username: defaultFieldRender,
  email: emailFieldRender,
  internalEmailAddress: emailFieldRender,
};
type Props = {
  user: User;
  showSettings: boolean;
  //feedItems: Array<any>,
  //feed: Object,
  isMe: boolean;
  loggedIn: boolean;
  loading: boolean;
  previousEvents: Array<Event>;
  upcomingEvents: Array<Event>;
  addPenalty: (arg0: AddPenalty) => void;
  deletePenalty: (arg0: number) => Promise<void>;
  penalties: Penalty[];
  canDeletePenalties: boolean;
  groups: Array<Group>;
  canChangeGrade: boolean;
  canEditEmailLists: boolean;
  changeGrade: (arg0: ID, arg1: string) => Promise<void>;
  updatePhotoConsent: (
    photoConsent: PhotoConsent,
    username: string,
    userId: number
  ) => Promise<void>;
  photoConsents: Array<PhotoConsent>;
};

const GroupPill = ({ group }: { group: Group }) =>
  group.showBadge ? (
    <Pill
      key={group.id}
      style={{
        margin: '5px',
      }}
    >
      {group.name}
    </Pill>
  ) : null;

const BadgeTooltip = ({
  group,
  start,
  end,
}: {
  group: Group;
  start: Dateish;
  end: Dateish | null | undefined;
}) => {
  const startYear = moment(start).year();
  const endYear = end ? moment(end).year() : 'd.d.';
  return <>{`${group.name} (${startYear} - ${endYear})`}</>;
};

const GroupBadge = ({
  memberships,
}: {
  memberships: (UserMembership & { abakusGroup: Group })[];
}) => {
  const activeMemberships = memberships.find(
    (membership) => membership.isActive
  );
  const abakusGroup = memberships[0].abakusGroup;
  if (!abakusGroup.showBadge) return null;
  // $FlowFixMe
  const sortedMemberships = orderBy(memberships, (membership) =>
    moment(membership.startDate || membership.createdAt)
  );
  const firstMembership = sortedMemberships[0];
  const lastMembership = sortedMemberships[sortedMemberships.length - 1];
  const { id, name, logo } = abakusGroup;
  const groupElement = (
    <Tooltip
      key={id}
      content={
        <BadgeTooltip
          group={abakusGroup}
          start={firstMembership.startDate || firstMembership.createdAt}
          end={lastMembership.endDate}
        />
      }
    >
      <CircularPicture
        alt={name}
        src={logo}
        size={50}
        style={{
          margin: '10px 5px',
          ...(!activeMemberships
            ? {
                filter: 'grayscale(100%)',
                opacity: '70%',
              }
            : {}),
        }}
      />
    </Tooltip>
  );
  const link = resolveGroupLink(abakusGroup);

  if (!link) {
    return groupElement;
  }

  return (
    <Link key={id} to={link}>
      {groupElement}
    </Link>
  );
};

type PermissionTreeNode = Group & {
  children?: Group[];
  parent?: number;
  isMember?: boolean;
};

type PermissionTree = { [key: number]: PermissionTreeNode };

const UserProfile = (props: Props) => {
  const [showAbaId, setShowAbaId] = useState(false);

  const sumPenalties = () => {
    return sumBy(props.penalties, 'weight');
  };

  const renderFields = () => {
    const { user } = props;
    const fields = Object.keys(fieldTranslations).filter(
      (field) => user[field]
    );
    const tags = fields.map((field) => (
      <li key={field}>
        {fieldRenders[field](fieldTranslations[field], user[field])}
      </li>
    ));
    return <ul>{tags}</ul>;
  };

  const {
    user,
    isMe,
    showSettings,
    //feedItems,
    //feed,
    loading,
    previousEvents,
    upcomingEvents,
    addPenalty,
    deletePenalty,
    penalties,
    canDeletePenalties,
    groups,
    canChangeGrade,
    changeGrade,
    canEditEmailLists,
    updatePhotoConsent,
  } = props;
  //If you wonder what this is, ask somebody
  const FRAMEID = [6050, 5962, 7276, 7434, 7747];
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
    permissionsPerGroup.concat(
      permissionsPerGroup.flatMap(({ parentPermissions }) => parentPermissions)
    ),
    (a) => a.abakusGroup.id
  );
  const allAbakusGroups = allAbakusGroupsWithPerms.map(
    ({ abakusGroup }) => abakusGroup
  );
  const { membershipsAsBadges = [], membershipsAsPills = [] } = groupBy(
    memberships.filter(Boolean).map((membership) => ({
      ...membership,
      abakusGroup: abakusGroups.find((g) => g.id === membership.abakusGroup),
    })),
    (membership) =>
      membership.abakusGroup.logo ? 'membershipsAsBadges' : 'membershipsAsPills'
  );
  const { pastMembershipsAsBadges = [] } = groupBy(
    pastMemberships.filter(Boolean),
    (m) =>
      m.abakusGroup.logo ? 'pastMembershipsAsBadges' : 'pastMembershipsAsPills'
  );
  const filteredPastMembershipsAsBadges = pastMembershipsAsBadges.filter(
    (membership) => {
      const membershipDuration = moment.duration(
        moment(membership.endDate).diff(membership.startDate)
      );
      return (
        membership.abakusGroup.type !== 'interesse' ||
        membershipDuration.asWeeks() > 2
      );
    }
  );

  const groupedMemberships = orderBy(
    groupBy(
      filteredPastMembershipsAsBadges.concat(
        membershipsAsBadges as User['pastMemberships']
      ),
      'abakusGroup.id'
    ),
    [
      (memberships) => !memberships.some((membership) => membership.isActive),
      (memberships) => memberships[0].abakusGroup.type === 'interesse',
      (memberships) => memberships[0].abakusGroup.type !== 'styre',
    ]
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
  }, []);

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

  const emailListsMapping = allAbakusGroups
    .map((abakusGroup) => ({
      abakusGroup,
      emailLists: abakusEmailLists.filter((emailList) =>
        emailList.groups.includes(abakusGroup.id)
      ),
    }))
    .filter(({ emailLists }) => emailLists.length);

  const emailListsOnUser = abakusEmailLists.filter((emailList) =>
    emailList.users.includes(user.id)
  );
  const hasFrame = FRAMEID.includes(user.id);
  return (
    <div className={styles.root}>
      <Helmet title={`${firstName} ${lastName}`} />

      <Modal
        contentClassName={styles.abaIdModal}
        show={showAbaId}
        onHide={() => {
          setShowAbaId(false);
        }}
      >
        <QRCode value={props.user?.username ?? ''} />
        <h2>{props.user?.username}</h2>
      </Modal>

      <Flex wrap className={styles.header}>
        <Flex column alignItems="center" className={styles.sidebar}>
          <Flex alignItems="center" justifyContent="center">
            {hasFrame && (
              <Image alt="Golden frame" className={styles.frame} src={frame} />
            )}
            <ProfilePicture user={user} size={150} />
          </Flex>
          {isMe && (
            <Button
              className={
                hasFrame
                  ? cx(styles.abaIdButton, styles.frameMargin)
                  : styles.abaIdButton
              }
              onClick={() => {
                setShowAbaId(true);
              }}
            >
              <Icon className={styles.qrIcon} name="qr-code" size={18} />
              Vis ABA-ID
            </Button>
          )}
        </Flex>
        <Flex column className={styles.rightContent}>
          <h2>{user.fullName}</h2>
          <Flex wrap>
            {membershipsAsPills.map((membership) => (
              <GroupPill key={membership.id} group={membership.abakusGroup} />
            ))}
          </Flex>
          <Flex wrap>
            {groupedMemberships.map((memberships) => (
              <GroupBadge memberships={memberships} key={memberships[0].id} />
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex wrap className={styles.content}>
        <div className={styles.info}>
          <div>
            <h3>Brukerinfo</h3>
            <Card className={styles.infoCard}>
              {renderFields()}
              {showSettings ? (
                <Link to={`/users/${user.username}/settings/profile`}>
                  Innstillinger
                </Link>
              ) : (
                ''
              )}
            </Card>
          </div>

          {showSettings && (
            <div>
              <h3>Prikker ({sumPenalties()} stk)</h3>
              <Card className={styles.infoCard}>
                <Penalties
                  penalties={penalties}
                  addPenalty={addPenalty}
                  deletePenalty={deletePenalty}
                  username={user.username}
                  userId={user.id}
                  canDeletePenalties={canDeletePenalties}
                />
              </Card>
            </div>
          )}
          {showSettings && photoConsents?.length > 0 && (
            <div>
              <h3>Bildesamtykke</h3>
              <Card>
                <PhotoConsents
                  photoConsents={photoConsents}
                  username={user.username}
                  updatePhotoConsent={updatePhotoConsent}
                  userId={user.id}
                  isMe={isMe}
                />
              </Card>
            </div>
          )}

          {canChangeGrade && (
            <div>
              <h3>Endre Klasse</h3>
              <Card className={styles.infoCard}>
                <GroupChange
                  grades={groups}
                  abakusGroups={abakusGroups}
                  changeGrade={changeGrade}
                  username={user.username}
                />
              </Card>
            </div>
          )}

          {!!permissionsPerGroup.length && (
            <div>
              <h3> Grupper </h3>
              <Card className={styles.infoCard}>
                {genTree(sum)}

                <div>
                  <br />
                  <i
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Du er medlem av gruppene markert med fet tekst, og indirekte
                    medlem av gruppene i kursiv.
                  </i>
                </div>
              </Card>
            </div>
          )}

          {/* canChangeGrade is a good heuristic if we should show permissions.
               All users can see their own permission via the API,
               but only admins can show permissions for other users.*/}
          {emailListsMapping.length + emailListsOnUser.length > 0 && (
            <div>
              <h3>Epostlister</h3>
              <Card className={styles.infoCard}>
                {emailListsMapping.map(({ abakusGroup, emailLists }) => (
                  <div key={abakusGroup.id}>
                    <h4>Epostlister fra gruppen {abakusGroup.name}</h4>
                    <ul>
                      {emailLists.map((emailList) => (
                        <li key={emailList.id}>
                          <Tooltip content={emailList.name}>
                            {emailList.email}@abakus.no{' '}
                            {canEditEmailLists && (
                              <Link to={`/admin/email/lists/${emailList.id}`}>
                                <i
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  endre
                                </i>
                              </Link>
                            )}
                          </Tooltip>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {emailListsOnUser.length > 0 && (
                  <>
                    <h4>Direkte koblet til deg som bruker</h4>
                    <ul>
                      {emailListsOnUser.map((emailList) => (
                        <li key={emailList.id}>
                          <Tooltip content={emailList.name}>
                            {emailList.email}@abakus.no{' '}
                            {canEditEmailLists && (
                              <Link to={`/admin/email/lists/${emailList.id}`}>
                                <i
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  endre
                                </i>
                              </Link>
                            )}
                          </Tooltip>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div>
                  <br />
                  <i
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Kontakt Webkom på{' '}
                    <a href="mailto:webkom@abakus.no"> webkom@abakus.no </a>
                    hvis du mener noen av disse ikke er riktige
                  </i>
                </div>
              </Card>
            </div>
          )}

          {canChangeGrade && (
            <div>
              <h3>Rettigheter</h3>
              <Card className={styles.infoCard}>
                {allAbakusGroupsWithPerms.map(
                  ({ abakusGroup, permissions }) =>
                    !!permissions.length && (
                      <div key={abakusGroup.id}>
                        <h4>
                          Rettigheter fra gruppen
                          <Link
                            to={`/admin/groups/${abakusGroup.id}/permissions/`}
                          >
                            {' '}
                            {abakusGroup.name}
                          </Link>
                        </h4>
                        <ul>
                          {permissions.map((permission) => (
                            <li key={permission + abakusGroup.id}>
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
                <h4>Sum alle</h4>
                <ul>
                  {sortBy(
                    permissionsPerGroup
                      .concat(
                        permissionsPerGroup.flatMap(
                          ({ parentPermissions }) => parentPermissions
                        )
                      )
                      .flatMap(({ permissions }) => permissions),
                    (permission: string) => permission.split('/').length
                  )
                    .reduce((acc: Array<string>, perm: string) => {
                      // Reduce perms to only show broadest set of permissions
                      // If a user has "/sudo/admin/events/" it means the user also has "/sudo/admin/events/create/" implicitly.
                      // Therefore we will only show "/sudo/admin/events/"
                      const splittedPerm = perm.split('/').filter(Boolean);
                      // YES, this has a bad runtime complexity, but since n is so small it doesn't matter in practice
                      const [broaderPermFound] = splittedPerm.reduce(
                        (accumulator: [boolean, string], permPart: string) => {
                          const [broaderPermFound, summedPerm] = accumulator;
                          const concatedString = `${summedPerm}${permPart}/`;
                          return [
                            broaderPermFound || acc.includes(concatedString),
                            concatedString,
                          ];
                        },
                        [false, '/']
                      );
                      if (broaderPermFound) return acc;
                      return [...acc, perm];
                    }, [])
                    .map((permission) => (
                      <li key={permission}>{permission}</li>
                    ))}
                </ul>
              </Card>
            </div>
          )}

          {isMe && user.email !== user.emailAddress && (
            <div>
              <h3>Google GSuite</h3>
              <Card className={styles.infoCard}>
                <p>
                  Din konto er linket opp mot Abakus sitt domene i Google
                  GSuite. E-post sendes til denne brukeren og ikke til e-posten
                  du har oppgitt i din profil.
                </p>

                <ul>
                  <li>
                    <b>URL:</b>{' '}
                    <a href="http://mail.abakus.no">mail.abakus.no</a>
                  </li>
                  <li>
                    <b>E-post:</b> {user.emailAddress}
                  </li>
                  <li>
                    <b>Passord:</b> <i>Ditt abakus passord</i>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </div>
        <div className={styles.rightContent}>
          {/*
           <h3>Nylig Aktivitet</h3>
           {feed ? (
             <Feed items={feedItems} feed={feed} />
           ) : (
             <LoadingIndicator loading />
           )}
           */}
          {isMe && (
            <div className={styles.bottomMargin}>
              <h3>Dine kommende arrangementer</h3>
              <EventListCompact
                events={orderBy(upcomingEvents, 'startTime')}
                noEventsMessage="Du har ingen kommende arrangementer"
                eventStyle="compact"
                loading={loading}
              />
              <h3>
                Dine tidligere arrangementer (
                {previousEvents === undefined ? 0 : previousEvents.length})
              </h3>
              <EventListCompact
                events={
                  previousEvents === undefined
                    ? []
                    : orderBy(
                        previousEvents
                          .filter((e) => e.userReg.pool !== null)
                          .filter((e) => e.userReg.presence !== 'NOT_PRESENT'),
                        'startTime'
                      ).reverse()
                }
                noEventsMessage="Du har ingen tidligere arrangementer"
                eventStyle="extra-compact"
                loading={loading}
              />
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default UserProfile;
