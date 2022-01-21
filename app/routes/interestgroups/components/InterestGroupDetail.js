// @flow

import styles from './InterestGroup.css';
import { Helmet } from 'react-helmet';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import UserGrid from 'app/components/UserGrid';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import DisplayContent from 'app/components/DisplayContent';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import type { Group, User, GroupMembership, ID } from 'app/models';
import InterestGroupMemberList from './InterestGroupMemberList';

type TitleProps = {
  group: Group,
  showEdit: boolean,
};

const Title = ({ group: { name, id }, showEdit }: TitleProps) => (
  <NavigationTab title={name}>
    <NavigationLink to="/interestgroups/">
      <i className="fa fa-angle-left" /> Tilbake
    </NavigationLink>
    {showEdit && (
      <NavigationLink to={`/interestgroups/${id}/edit`}>Rediger</NavigationLink>
    )}
  </NavigationTab>
);

type MembersProps = {
  members: Array<GroupMembership>,
  group: Group,
};

const Members = ({ group, members }: MembersProps) => (
  <Flex column>
    <h4>Medlemmer {group.numberOfUsers}</h4>
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
  group: Group,
  currentUser: User,
  leaveGroup: (GroupMembership, ID) => void,
  joinGroup: (ID, User) => void,
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
      <Button onClick={onClick}>
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
  joinGroup: (ID, User) => void,
  leaveGroup: (GroupMembership) => void,
  currentUser: User,
  group: Group,
};

function InterestGroupDetail(props: Props) {
  const { group } = props;
  const canEdit = group.actionGrant && group.actionGrant.includes('edit');
  const logo = group.logo || 'https://i.imgur.com/Is9VKjb.jpg';
  return (
    <Content>
      <Helmet title={group.name} />
      <Title group={group} showEdit={canEdit} />
      <ContentSection>
        <ContentMain>
          <p className={styles.description}>{group.description}</p>
          <DisplayContent content={group.text} />
          <ButtonRow {...props} />
        </ContentMain>
        <ContentSidebar>
          <Image
            className={styles.logo}
            src={logo}
            placeholder={group.logoPlaceholder}
          />
          <Members group={group} members={group.memberships} />
          <Contact group={group} />
          <AnnouncementInLine
            placeholder="Skriv en kunngjøring til alle medlemmer..."
            group={group.id}
            button
          />
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
}

export default InterestGroupDetail;
