// @flow

import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import styles from './InterestGroupMemberList.css';
import { Link } from 'react-router';
import { ProfilePicture } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import type { User, GroupMembership } from 'app/models';

const iconName = (role: string) => {
  switch (role) {
    case 'leader':
      return ['star', 'Leder'];
    case 'co-leader':
      return ['star-outline', 'Nestleder'];
    default:
      return;
  }
};

const icon = (role: string) => {
  const props = iconName(role);
  if (props) {
    const [name, tooltip] = props;
    return (
      <Tooltip content={tooltip}>
        <Icon name={name} />
      </Tooltip>
    );
  }
};

const ListedUser = ({ user, role }: { user: User, role: string }) => {
  return (
    <li>
      <Flex className={styles.row}>
        <ProfilePicture size={30} user={user} />
        {icon(role)}
        <Link to={`/users/${user.username}`}>{user.fullName}</Link>
      </Flex>
    </li>
  );
};

const rolePriority = ['leader', 'co-leader'];

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
    this.props.memberships.sort((a, b) => {
      for (let i = 0; i < rolePriority.length; i++) {
        if (a.role === rolePriority[i]) return -1;
        if (b.role === rolePriority[i]) return 1;
      }
      return 0;
    });
    return (
      <div>
        <div onClick={this.toggleModal}>{this.props.children}</div>
        <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
          <h2>Medlemmer</h2>
          <ul className={styles.list}>
            {this.props.memberships.map(membership => (
              <ListedUser
                key={membership.user.id}
                user={membership.user}
                role={membership.role}
              />
            ))};
          </ul>
        </Modal>
      </div>
    );
  }
}
