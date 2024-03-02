import { Flex, Icon, Modal } from '@webkom/lego-bricks';
import sortBy from 'lodash/sortBy';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import TextInput from 'app/components/Form/TextInput';
import { ProfilePicture } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import shared from 'app/components/UserAttendance/AttendanceModalContent.css';
import styles from './InterestGroupMemberList.css';
import type { User, GroupMembership } from 'app/models';
import type { RoleType } from 'app/utils/constants';
import type { ReactNode } from 'react';

const Name = ({ user, role }: { user: User; role: RoleType }) => {
  if (role === 'member') {
    return <span>{user.fullName}</span>;
  }

  let roleStyle;
  switch (role) {
    case 'leader':
      roleStyle = styles.leader;
      break;

    case 'co-leader':
      roleStyle = styles.coleader;
      break;

    default:
      break;
  }
  return <span className={roleStyle}>{user.fullName} </span>;
};

const RoleIcon = ({ role }: { role: RoleType }) => {
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

    case 'co-leader':
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

const ListedUser = ({ user, role }: { user: User; role: RoleType }) => (
  <li>
    <Flex alignItems="center" gap={10} className={shared.row}>
      <ProfilePicture size={30} user={user} />
      <RoleIcon role={role} />
      <Link to={`/users/${user.username}`}>
        <Name user={user} role={role} />
      </Link>
    </Flex>
  </li>
);

// Reversed sort order
const SORT_ORDER = ['member', 'co_leader', 'leader'];
type Props = {
  children: ReactNode;
  memberships: GroupMembership[];
};
type State = {
  modalVisible: boolean;
  filter: string;
};
export default class InterestGroupMemberList extends Component<Props, State> {
  state = {
    modalVisible: false,
    filter: '',
  };
  toggleModal = () => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
    }));
  };

  render() {
    const memberships = this.props.memberships.filter((membership) =>
      membership.user.fullName
        .toLowerCase()
        .includes(this.state.filter.toLowerCase()),
    );
    const sorted = sortBy(memberships, ({ role }) =>
      SORT_ORDER.indexOf(role),
    ).reverse();

    return (
      <>
        <div onClick={this.toggleModal}>{this.props.children}</div>
        <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
          <Flex column gap="var(--spacing-md)" className={shared.modal}>
            <h2>Medlemmer</h2>
            <TextInput
              type="text"
              prefix="search"
              placeholder="Søk etter navn"
              onChange={(e) => this.setState({ filter: e.target.value })}
            />

            <ul className={shared.list}>
              {sorted.map((membership) => (
                <ListedUser
                  key={membership.user.id}
                  user={membership.user}
                  role={membership.role}
                />
              ))}
            </ul>
          </Flex>
        </Modal>
      </>
    );
  }
}
