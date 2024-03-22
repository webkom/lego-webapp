import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
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
import { selectCurrentUser, selectIsLoggedIn } from 'app/reducers/auth';
import { selectGroupById } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './InterestGroup.css';
import InterestGroupMemberList from './InterestGroupMemberList';
import type { TransformedMembership } from 'app/reducers/memberships';
import type { PublicDetailedGroup } from 'app/store/models/Group';

type MembersProps = {
  memberships: TransformedMembership[];
  group: PublicDetailedGroup;
};

const Members = ({ group, memberships }: MembersProps) => (
  <Flex column>
    <h4>{group.numberOfUsers} medlemmer</h4>
    <UserGrid
      users={memberships && memberships.slice(0, 14).map((reg) => reg.user)}
      maxRows={2}
      minRows={2}
    />
    <InterestGroupMemberList memberships={memberships}>
      <Flex className={styles.showMemberList}>Vis alle medlemmer</Flex>
    </InterestGroupMemberList>
  </Flex>
);

type ButtonRowProps = {
  group: PublicDetailedGroup;
  memberships: TransformedMembership[];
};
const ButtonRow = ({ group, memberships }: ButtonRowProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) return null;

  const [membership] = memberships.filter((m) => m.user.id === currentUser.id);

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
  const dispatch = useAppDispatch();
  const { groupId } =
    useParams<InterestGroupDetailParams>() as InterestGroupDetailParams;
  const group = useAppSelector(
    (state) =>
      selectGroupById(state, groupId) as PublicDetailedGroup | undefined,
  );
  const fetching = useAppSelector((state) => state.groups.fetching);
  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, { groupId }),
  );
  const loggedIn = useAppSelector(selectIsLoggedIn);

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
          {loggedIn && <ButtonRow group={group} memberships={memberships} />}
        </ContentMain>

        <ContentSidebar>
          {logo && (
            <Image
              alt={`${group.name} logo`}
              className={styles.logo}
              src={logo}
              placeholder={group.logoPlaceholder || undefined}
            />
          )}
          {memberships.length > 0 && (
            <>
              <Members group={group} memberships={memberships} />
              <Contact memberships={memberships} />
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
