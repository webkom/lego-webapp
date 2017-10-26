// @flow

import styles from './InterestGroup.css';
import React, { Component } from 'react';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { ProfilePicture } from 'app/components/Image';
import Editor from 'app/components/Editor';

import type { InterestGroup, User, GroupMembership, ID } from 'app/models';

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
    {showEdit && (
      <NavigationLink to={`/interestgroups/${id}/edit`}>
        [Rediger]
      </NavigationLink>
    )}
    <NavigationLink to={`/interestgroups/`}>[Tilbake]</NavigationLink>
  </NavigationTab>
);

const Description = ({ description }: { description: string }) => (
  <Flex className={styles.description}>{description}</Flex>
);

const Sidebar = ({ group }: { group: InterestGroup }) => (
  <Flex column className={styles.sideBar}>
    <Logo logo={group.logo || 'https://i.imgur.com/Is9VKjb.jpg'} />
    <Members group={group} members={group.memberships} />
    <Contact group={group} />
  </Flex>
);

const SidebarHeader = ({ text }: { text: string }) => (
  <div style={{ 'font-weight': 'bold' }}>{text}</div>
);

type MembersProps = {
  members: Array<GroupMembership>,
  group: Object
};

const Members = ({ group, members }: MembersProps) => (
  <Flex column>
    <SidebarHeader text={`Medlemmer (${group.numberOfUsers})`} />
    <Flex wrap>
      {members &&
        members
          .slice(0, 10)
          .map(reg => <RegisteredCell key={reg.user.id} user={reg.user} />)}
    </Flex>
  </Flex>
);

const Logo = ({ logo }: { logo: string }) => (
  <Flex justifyContent="center">
    <Image className={styles.logo} src={logo} />
  </Flex>
);

const Content = ({ group }: { group: InterestGroup }) => (
  <Flex column style={{ flex: '1' }}>
    <Editor value={group.text} readOnly={true} />
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
  const membership = group.memberships.filter(
    m => m.user.id === currentUser.id
  )[0];

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
        <SidebarHeader text="Leder" />
        Gruppen har ingen leder!
      </Flex>
    );
  }

  const leader = leaders[0];

  return (
    <Flex column>
      <SidebarHeader text="Leder" />
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

class InterestGroupDetail extends Component<Props> {
  joinGroup = () => {
    this.props.joinInterestGroup(this.props.group.id, this.props.currentUser);
  };

  leaveGroup = () => {
    const { group: { memberships = [] } } = this.props;
    const user = this.props.currentUser.id;
    const membership = memberships.find(m => m.user.id === user);
    membership && this.props.leaveInterestGroup(membership);
  };

  render() {
    const { group } = this.props;
    const canEdit = true;

    return (
      <Flex column className={styles.root}>
        <Title group={group} showEdit={canEdit} />
        <Description description={group.description} />
        <Flex style={{ background: 'white' }}>
          <Content group={group} />
          <Sidebar group={group} />
        </Flex>
        <ButtonRow {...this.props} />
      </Flex>
    );
  }
}

export default InterestGroupDetail;
