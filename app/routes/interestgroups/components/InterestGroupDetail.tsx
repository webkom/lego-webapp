import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
import type { Group, User, GroupMembership, ID } from 'app/models';
import styles from './InterestGroup.css';
import InterestGroupMemberList from './InterestGroupMemberList';

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
  group: Group;
  currentUser: User;
  leaveGroup: (arg0: GroupMembership, arg1: ID) => void;
  joinGroup: (arg0: ID, arg1: User) => void;
};

const ButtonRow = ({
  group,
  currentUser,
  joinGroup,
  leaveGroup,
}: ButtonRowProps) => {
  const [membership] = group.memberships.filter(
    (m) => m.user.id === currentUser.id
  );
  const onClick = membership
    ? () => leaveGroup(membership, group.id)
    : () => joinGroup(group.id, currentUser);
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

type Props = {
  joinGroup: (arg0: ID, arg1: User) => void;
  leaveGroup: (arg0: GroupMembership) => void;
  currentUser: User;
  group: Group;
};

function InterestGroupDetail(props: Props) {
  const { group } = props;
  const canEdit = group.actionGrant?.includes('edit');
  const logo = group.logo || 'https://i.imgur.com/Is9VKjb.jpg';
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
          <ButtonRow {...props} />
        </ContentMain>
        <ContentSidebar>
          <Image
            alt={`${group.name} logo`}
            className={styles.logo}
            src={logo}
            placeholder={group.logoPlaceholder}
          />
          <Members group={group} members={group.memberships} />
          <Contact group={group} />

          <h3>Admin</h3>
          {canEdit && (
            <Link to={`/interest-groups/${group.id}/edit`}>
              <Button>
                <Icon name="create-outline" size={19} />
                Rediger
              </Button>
            </Link>
          )}

          <AnnouncementInLine group={group} />
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
}

export default InterestGroupDetail;
