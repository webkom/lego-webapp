import { Flex, Icon, Modal, Tooltip } from '@webkom/lego-bricks';
import { sortBy } from 'lodash-es';
import { useState } from 'react';
import TextInput from '~/components/Form/TextInput';
import { ProfilePicture } from '~/components/Image';
import shared from '~/components/UserAttendance/AttendanceModalContent.module.css';
import styles from './InterestGroupMemberList.module.css';
import type { PublicUser } from '~/redux/models/User';
import type { TransformedMembership } from '~/redux/slices/memberships';
import type { RoleType } from '~/utils/constants';

const nameStyleByRole: Partial<Record<RoleType, string>> = {
  leader: styles.leader,
  ['co-leader']: styles.coleader,
};

type RoleIconInfo = {
  iconStyle: string;
  name: string;
  tooltip: string;
};
const roleIconInfoByRole: Partial<Record<RoleType, RoleIconInfo>> = {
  leader: {
    iconStyle: styles.leadericon,
    name: 'star',
    tooltip: 'Leder',
  },
  ['co-leader']: {
    iconStyle: styles.coleadericon,
    name: 'star-outline',
    tooltip: 'Nestleder',
  },
};
const RoleIcon = ({ role }: { role: RoleType }) => {
  const info = roleIconInfoByRole[role];
  if (!info) return null;

  const { iconStyle, name, tooltip } = info;
  return (
    <Tooltip content={tooltip}>
      <Icon name={name} className={iconStyle} />
    </Tooltip>
  );
};

const ListedUser = ({ user, role }: { user: PublicUser; role: RoleType }) => (
  <li>
    <Flex alignItems="center" gap={10} className={shared.row}>
      <ProfilePicture size={30} user={user} />
      <RoleIcon role={role} />
      <a href={`/users/${user.username}`}>
        <span className={nameStyleByRole[role]}>{user.fullName}</span>
      </a>
    </Flex>
  </li>
);

// Reversed sort order
const SORT_ORDER = ['member', 'co_leader', 'leader'];
type Props = {
  memberships: TransformedMembership[];
};
const InterestGroupMemberModal = ({ memberships }: Props) => {
  const [filter, setFilter] = useState('');

  const filteredMemberships = memberships.filter((membership) =>
    membership.user.fullName.toLowerCase().includes(filter.toLowerCase()),
  );
  const sorted = sortBy(filteredMemberships, ({ role }) =>
    SORT_ORDER.indexOf(role),
  ).reverse();

  return (
    <Modal title="Medlemmer">
      <Flex column gap="var(--spacing-md)" className={shared.modal}>
        <TextInput
          type="text"
          prefix="search"
          placeholder="Søk etter navn"
          onChange={(e) => setFilter(e.target.value)}
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
  );
};

export default InterestGroupMemberModal;
