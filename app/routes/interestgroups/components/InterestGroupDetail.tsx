import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import {
  fetchAllMemberships,
  fetchGroup,
  joinGroup,
  leaveGroup,
} from 'app/actions/GroupActions';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import { Image } from 'app/components/Image';
import NavigationTab from 'app/components/NavigationTab';
import UserGrid from 'app/components/UserGrid';
import { selectCurrentUser } from 'app/reducers/auth';
import { selectGroup } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './InterestGroup.css';
import InterestGroupMemberList from './InterestGroupMemberList';
import type { Group, GroupMembership } from 'app/models';
import type { DetailedGroup } from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';

type MembersProps = {
  members: Array<GroupMembership>;
  group: Group;
};

const Members = ({ group, members }: MembersProps) => (
  <Flex column>
    <h4>{group.numberOfUsers} medlemmer</h4>
    <UserGrid
      users={members && members.slice(0, 14).map((reg) => reg.user)}
      maxRows={2}
      minRows={2}
    />
    <InterestGroupMemberList memberships={members}>
      <Flex className={styles.showMemberList}>Vis alle medlemmer</Flex>
    </InterestGroupMemberList>
  </Flex>
);

type ButtonRowProps = {
  group: DetailedGroup & { memberships: Membership[] };
};

const ButtonRow = ({ group }: ButtonRowProps) => {
  const currentUser = useAppSelector((state) => selectCurrentUser(state));

  const [membership] = group.memberships.filter(
    (m) => m.user.id === currentUser.id
  );

  const dispatch = useAppDispatch();

  const onClick = membership
    ? () => dispatch(leaveGroup(membership, group.id))
    : () => dispatch(joinGroup(group.id, currentUser));

  return (
    <Flex>
      <Button
        success={membership === undefined}
        danger={membership !== undefined}
        onClick={onClick}
      >
        {membership ? 'Forlat gruppen' : 'Bli med i gruppen'}
      </Button>
    </Flex>
  );
};

const Contact = ({ group }: { group: Group }) => {
  const leaders = group.memberships.filter((m) => m.role === 'leader');

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

const InterestGroupDetail = () => {
  const { groupId } = useParams();
  const selectedGroup = useAppSelector((state) =>
    selectGroup(state, { groupId })
  );
  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, { groupId })
  );

  const group = { ...selectedGroup, memberships };
  const canEdit = group.actionGrant?.includes('edit');
  const logo = group.logo || 'https://i.imgur.com/Is9VKjb.jpg';

  const dispatch = useAppDispatch();

  const { loggedIn } = useUserContext();

  usePreparedEffect(
    'fetchInterestGroupDetail',
    () =>
      groupId &&
      Promise.resolve([
        dispatch(fetchGroup(groupId)),
        loggedIn && dispatch(fetchAllMemberships(groupId)),
      ]),
    [loggedIn]
  );

  return (
    <Content>
      <Helmet title={group.name} />
      <NavigationTab
        title={group.name}
        back={{
          label: 'Tilbake',
          path: '/interest-groups',
        }}
      />
      <ContentSection>
        <ContentMain>
          <p>{group.description}</p>
          <DisplayContent content={group.text} />
          {loggedIn && <ButtonRow group={group} />}
        </ContentMain>

        <ContentSidebar>
          <Image
            alt={`${group.name} logo`}
            className={styles.logo}
            src={logo}
            placeholder={group.logoPlaceholder}
          />
          {group.memberships.length > 0 && (
            <>
              <Members group={group} members={group.memberships} />
              <Contact group={group} />
            </>
          )}

          {canEdit && (
            <>
              <h3>Admin</h3>
              <Link to={`/interest-groups/${group.id}/edit`}>
                <Button>
                  <Icon name="create-outline" size={19} />
                  Rediger
                </Button>
              </Link>
            </>
          )}

          <AnnouncementInLine group={group} />
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default InterestGroupDetail;
