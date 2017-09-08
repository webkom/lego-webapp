import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import Editor from 'app/components/Editor';
import { Button } from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { FlexColumn, FlexRow, FlexItem } from 'app/components/FlexBox';
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

const ToggleLink = ({ text, onClick }) =>
  <button onClick={onClick} style={{ color: '#2284ba', 'font-size': '16px' }}>
    {text}
  </button>;

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
    <Logo logo="https://i.redd.it/dz8mwvl4dgdy.jpg" />
    <Members name={group.name} members={group.memberships} />
    <Contact group={group} />
  </Flex>;

const SidebarHeader = ({ text }) =>
  <div style={{ 'font-weight': 'bold' }}>
    {text}
  </div>;

const Members = ({ members, name }) =>
  <Flex column>
    <SidebarHeader text="Medlemmer" />
    <Flex>
      {members &&
        members
          .slice(0, 10)
          .map(reg => <RegisteredCell key={reg.user.id} user={reg.user} />)}
    </Flex>
  </Flex>;

const Logo = ({ logo }) => <Image className={styles.logo} src={logo} />;

const Text = ({ text }) =>
  <Flex style={{ margin: '1em' }}>
    {text}
  </Flex>;

const Contact = ({ group }) =>
  <Flex column>
    <SidebarHeader text="Kontaktinformasjon" />
    <ul>
      <li>Gamle Mannen</li>
      <li>+47 1234 5678</li>
      <li>martyboy@alphamale.com</li>
    </ul>
  </Flex>;

class InterestGroupDetail extends Component {
  state = {
    editorOpen: false
  };

  removeId = () => {
    console.log('remove');
    // this.props.removeInterestGroup(this.props.group.id);
  };

  updateId = args => {
    console.log('update');
    // this.props.updateInterestGroup(
    //   this.props.group.id,
    //   args
    // );
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
    const { group, group: { memberships = [] } } = this.props;
    const userId = this.props.currentUser.id;
    const isMember = memberships.find(m => m.user.id === userId);
    const canEdit = true;

    return (
      <Flex column className={styles.root}>
        <Title group={group} showEdit={canEdit} />
        <Description description={group.description} />
        <Flex style={{ background: 'white' }}>
          <Text text={group.descriptionLong} />
          <Sidebar group={group} />
        </Flex>
        <Contact />
      </Flex>
    );
  }
}

export default InterestGroupDetail;
