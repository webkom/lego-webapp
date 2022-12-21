import sortBy from 'lodash/sortBy';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { ProfilePicture } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
import Tooltip from 'app/components/Tooltip';
import type { User, GroupMembership } from 'app/models';
import styles from './InterestGroupMemberList.css';
import type { ReactNode } from 'react';

const ExtraInfo = ({ user, role }: { user: User; role: string }) => {
  if (role === 'member') {
    return <span>{user.fullName}</span>;
  }

  let title: string;
  let roleStyle;
  switch (role) {
    case 'leader':
      title = '(Leder)';
      roleStyle = styles.leader;
      break;

    case 'co_leader':
      title = '(Nestleder)';
      roleStyle = styles.coleader;
      break;

    default:
      break;
  }

  return (
    <span>
      <span className={roleStyle}>{user.fullName} </span>
      <span className={styles.suffix}>{title}</span>
    </span>
  );
};

const RoleIcon = ({ role }: { role: string }) => {
  if (role === 'member') {
    return null;
  }

  let iconStyle;
  let props;

  switch (role) {
    case 'leader':
      iconStyle = styles.leadericon;
      props = ['star', 'Leder'];
      break;

    case 'co_leader':
      iconStyle = styles.coleadericon;
      props = ['star-outline', 'Nestleder'];
      break;

    default:
      return null;
  }

  const [name, tooltip] = props;
  return (
    <Tooltip content={tooltip}>
      <Icon name={name} className={iconStyle} />
    </Tooltip>
  );
};

const ListedUser = ({ user, role }: { user: User; role: string }) => (
  <li>
    <Flex className={styles.row}>
      <ProfilePicture size={30} user={user} alt="Profilbilde" />
      <RoleIcon role={role} />
      <Link to={`/users/${user.username}`}>
        <ExtraInfo user={user} role={role} />
      </Link>
    </Flex>
  </li>
);

// Reversed sort order
const SORT_ORDER = ['member', 'co_leader', 'leader'];
type Props = {
  children: ReactNode;
  memberships: Array<GroupMembership>;
};
type State = {
  modalVisible: boolean;
};
export default class InterestGroupMemberList extends Component<Props, State> {
  state = {
    modalVisible: false,
  };
  toggleModal = () => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
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
            {sorted.map((membership) => (
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
