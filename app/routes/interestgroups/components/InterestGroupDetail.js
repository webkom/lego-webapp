import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import ProfilePicture from 'app/components/ProfilePicture';

// TODO: this is from the event detail page.
// We can probably move this out to somewhere common.
const RegisteredCell = ({ user }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={60} user={user} />
    </Link>
  </Tooltip>
);

const Title = ({ group: { name, id }, showEdit, editClick }) =>
  <NavigationTab title={name}>
    {showEdit &&
      <NavigationLink to={`/interestgroups/${id}/edit`}>
        [Rediger]
      </NavigationLink>}
  </NavigationTab>;

const Description = ({ description }) =>
  <Flex className={styles.description}>
    {description}
  </Flex>;

const Sidebar = ({ group }) =>
  <Flex column style={{ margin: '15px', width: '300px' }}>
    <Logo logo="https://i.imgur.com/Is9VKjb.jpg" />
    <Members name={group.name} members={group.memberships} />
    <Contact group={group} />
  </Flex>;

const SidebarHeader = ({ text }) =>
  <div style={{ 'font-weight': 'bold' }}>
    {text}
  </div>;

const Members = ({ members, name }) =>
  <Flex column>
    <SidebarHeader text={`Medlemmer (${members.length})`} />
    <Flex>
      {members &&
        members
          .slice(0, 10)
          .map(reg => <RegisteredCell key={reg.user.id} user={reg.user} />)}
    </Flex>
  </Flex>;

const Logo = ({ logo }) =>
  <Flex justifyContent="center">
    <Image className={styles.logo} src={logo} />
  </Flex>;

const Content = ({ group }) =>
  <Flex justifyContent="space-between">
    <Text text={group.descriptionLong} />
  </Flex>;

const Text = ({ text }) =>
  <Flex style={{ margin: '1em' }}>
    <div>
      {text}
    </div>
  </Flex>;

const Contact = ({ group }) => {
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

class InterestGroupDetail extends Component {
  state = {
    editorOpen: false
  };

  joinGroup = () => {
    this.props.joinInterestGroup(this.props.group.id, this.props.currentUser);
  };

  leaveGroup = () => {
    const { group: { memberships = [] } } = this.props;
    const user = this.props.currentUser.id;
    const membership = memberships.find(m => m.user.id === user);
    this.props.leaveInterestGroup(membership);
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
      </Flex>
    );
  }
}

export default InterestGroupDetail;
