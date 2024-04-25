import {
  Button,
  ButtonGroup,
  DialogTrigger,
  Flex,
  Icon,
  LinkButton,
  LoadingIndicator,
  Image,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Pencil } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  fetchAllMemberships,
  fetchGroup,
  fetchMemberships,
  joinGroup,
  leaveGroup,
} from 'app/actions/GroupActions';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import {
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import UserGrid from 'app/components/UserGrid';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectGroupById } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './InterestGroup.module.css';
import InterestGroupMemberModal from './InterestGroupMemberModal';
import type { TransformedMembership } from 'app/reducers/memberships';
import type { PublicDetailedGroup } from 'app/store/models/Group';

type MembersProps = {
  memberships: TransformedMembership[];
  group: PublicDetailedGroup;
  fetching: boolean;
};

const Members = ({ group, memberships, fetching }: MembersProps) => (
  <Flex column>
    <h4>{group.numberOfUsers} medlemmer</h4>
    <UserGrid
      users={memberships && memberships.slice(0, 14).map((reg) => reg.user)}
      skeleton={fetching}
      maxRows={2}
      minRows={2}
    />
    <DialogTrigger>
      <Button flat>Vis alle medlemmer</Button>
      <InterestGroupMemberModal memberships={memberships} />
    </DialogTrigger>
  </Flex>
);

type ButtonRowProps = {
  group: PublicDetailedGroup;
  memberships: TransformedMembership[];
};

const ButtonRow = ({ group, memberships }: ButtonRowProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;

  const [membership] = memberships.filter((m) => m.user.id === currentUser.id);

  const onClick = membership
    ? () => dispatch(leaveGroup(membership, group.id))
    : () => dispatch(joinGroup(group.id, currentUser));

  return (
    <ButtonGroup>
      <Button
        success={membership === undefined}
        danger={membership !== undefined}
        onPress={onClick}
      >
        {membership ? 'Forlat gruppen' : 'Bli med i gruppen'}
      </Button>
    </ButtonGroup>
  );
};

const Contact = ({ memberships }: { memberships: TransformedMembership[] }) => {
  const leaders = memberships.filter((m) => m.role === 'leader');

  if (leaders.length === 0) {
    return (
      <Flex column>
        <h4>Leder</h4>
        Gruppen har ingen leder!
      </Flex>
    );
  }

  if (leaders.length > 1) {
    return (
      <Flex column>
        <h4>Ledere</h4>
        <ul>
          {leaders.map((leader) => (
            <li key={leader.user.username}>{leader.user.fullName}</li>
          ))}
        </ul>
      </Flex>
    );
  }

  const leader = leaders[0];
  return (
    <Flex column>
      <h4>Leder</h4>
      {leader.user.fullName}
    </Flex>
  );
};

type InterestGroupDetailParams = {
  groupId: string;
};
const InterestGroupDetail = () => {
  const { groupId } =
    useParams<InterestGroupDetailParams>() as InterestGroupDetailParams;
  const group = useAppSelector((state) =>
    selectGroupById<PublicDetailedGroup>(state, groupId),
  );
  const fetching = useAppSelector((state) => state.groups.fetching);
  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, { groupId }),
  );
  const announcementActionGrant = useAppSelector(
    (state) => state.allowed.announcements,
  );

  const dispatch = useAppDispatch();

  const loggedIn = useIsLoggedIn();

  usePreparedEffect(
    'fetchInterestGroupDetail',
    () =>
      groupId &&
      Promise.allSettled([
        dispatch(fetchGroup(groupId)),
        loggedIn && dispatch(fetchAllMemberships(groupId)),
      ]),
    [groupId, loggedIn],
  );

  if (!group || fetching) {
    return <LoadingIndicator loading={true} />;
  }

  const canEdit = group.actionGrant?.includes('edit');
  const logo = group.logo;

  return (
    <Page title={group.name} back={{ href: '/interest-groups' }}>
      <Helmet title={group.name} />
      <ContentSection>
        <ContentMain>
          <p>{group.description}</p>
          <DisplayContent content={group.text} />
          {loggedIn && <ButtonRow group={group} memberships={memberships} />}
        </ContentMain>

        <ContentSidebar>
          {logo && (
            <Image
              alt={`${group.name} sin logo`}
              className={styles.logo}
              src={logo}
              placeholder={group.logoPlaceholder || undefined}
            />
          )}
          {memberships.length > 0 && (
            <>
              <Members
                group={group}
                memberships={memberships}
                fetching={fetching}
              />
              <Contact memberships={memberships} />
            </>
          )}

          {(canEdit || announcementActionGrant) && (
            <div>
              <h3>Admin</h3>
              <ButtonGroup>
                {canEdit && (
                  <LinkButton href={`/interest-groups/${group.id}/edit`}>
                    <Icon iconNode={<Pencil />} size={19} />
                    Rediger
                  </LinkButton>
                )}
                <AnnouncementInLine group={group} />
              </ButtonGroup>
            </div>
          )}
        </ContentSidebar>
      </ContentSection>
    </Page>
  );
};

export default InterestGroupDetail;
