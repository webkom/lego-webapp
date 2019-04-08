// @flow

import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import styles from './InterestGroupMemberList.css';
import { Link } from 'react-router-dom';
import { ProfilePicture } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import type { User, GroupMembership } from 'app/models';
import sortBy from 'lodash/sortBy';

const iconName = (role: string) => {
  switch (role) {
    case 'leader':
      return ['star', 'Leder'];
    case 'co_leader':
      return ['star-outline', 'Nestleder'];
    default:
      return;
  }
};

const RoleIcon = ({ role }: { role: string }) => {
  const props = iconName(role);
  if (props) {
    const [name, tooltip] = props;
    return (
      <Tooltip content={tooltip}>
        <Icon name={name} />
      </Tooltip>
    );
  }
  return null;
};

const ListedUser = ({ user, role }: { user: User, role: string }) => (
  <li>
    <Flex className={styles.row}>
      <ProfilePicture size={30} user={user} />
      <RoleIcon role={role} />
      <Link to={`/users/${user.username}`}>{user.fullName}</Link>
    </Flex>
  </li>
);

// Reversed sort order
const SORT_ORDER = ['member', 'co_leader', 'leader'];

type Props = {
  children: any,
  memberships: Array<GroupMembership>
};

type State = {
  modalVisible: boolean
};

export default class InterestGroupMemberList extends Component<Props, State> {
  state = { modalVisible: false };

  toggleModal = () => {
    this.setState(state => ({
      modalVisible: !state.modalVisible
    }));
  };

  render() {
    const sorted = sortBy(this.props.memberships, ({ role }) =>
      SORT_ORDER.indexOf(role)
    ).reverse();
    return (
      <div>
        <div onClick={this.toggleModal}>{this.props.children}</div>
        <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
          <h2>Medlemmer</h2>
          <ul className={styles.list}>
            {sorted.map(membership => (
              <ListedUser
                key={membership.user.id}
                user={membership.user}
                role={membership.role}
              />
            ))}
          </ul>
        </Modal>
      </div>
    );
  }
}
