// @flow

import styles from './InterestGroup.css';
import React from 'react';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import {
  Content,
  ContentSection,
  ContentMain,
  ContentSidebar
} from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { ProfilePicture } from 'app/components/Image';
import DisplayContent from 'app/components/DisplayContent';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import type { InterestGroup, User, GroupMembership, ID } from 'app/models';
import InterestGroupMemberList from './InterestGroupMemberList';

// TODO: this is from the event detail page.
// We can probably move this out to somewhere common.
const RegisteredCell = ({ user }: { user: User }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={60} user={user} />
    </Link>
  </Tooltip>
);

type TitleProps = {
  group: InterestGroup,
  showEdit: boolean
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
  group: Object
};

const Members = ({ group, members }: MembersProps) => (
  <Flex column>
    <h4>Medlemmer {group.numberOfUsers}</h4>
    <Flex wrap>
      {members &&
        members
          .slice(0, 10)
          .map(reg => <RegisteredCell key={reg.user.id} user={reg.user} />)}
    </Flex>
    <InterestGroupMemberList memberships={members}>
      <Flex className={styles.showMemberList}>Vis alle medlemmer</Flex>
    </InterestGroupMemberList>
  </Flex>
);

type ButtonRowProps = {
  group: InterestGroup,
  currentUser: User,
  leaveInterestGroup: (GroupMembership, ID) => void,
  joinInterestGroup: (ID, User) => void
};

const ButtonRow = ({
  group,
  currentUser,
  joinInterestGroup,
  leaveInterestGroup
}: ButtonRowProps) => {
  const [membership] = group.memberships.filter(
    m => m.user.id === currentUser.id
  );

  const onClick = membership
    ? () => leaveInterestGroup(membership, group.id)
    : () => joinInterestGroup(group.id, currentUser);

  return (
    <Flex>
      <Button onClick={onClick}>
        {membership ? 'Forlat Gruppen' : 'Bli med i gruppen'}
      </Button>
    </Flex>
  );
};

const Contact = ({ group }: { group: InterestGroup }) => {
  const leaders = group.memberships.filter(m => m.role === 'leader');

  if (leaders.length == 0) {
    return (
      <Flex column>
        <h4>Leder</h4>
        Gruppen har ingen leder!
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
  joinInterestGroup: (ID, User) => void,
  leaveInterestGroup: GroupMembership => void,
  currentUser: User,
  group: InterestGroup
};

function InterestGroupDetail(props: Props) {
  const { group } = props;
  const logo = group.logo || 'https://i.imgur.com/Is9VKjb.jpg';
  return (
    <Content>
      <Title group={group} showEdit />
      <ContentSection>
        <ContentMain>
          <p className={styles.description}>{group.description}</p>
          <DisplayContent content={group.text} />
          <ButtonRow {...props} />
        </ContentMain>
        <ContentSidebar>
          <Image className={styles.logo} src={logo} />
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
