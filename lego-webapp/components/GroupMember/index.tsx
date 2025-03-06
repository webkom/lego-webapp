import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ProfilePicture } from '~/components/Image';
import { ROLES, type RoleType } from '~/utils/constants';
import styles from './GroupMember.module.css';
import type { PublicUser } from '~/redux/models/User';

type Props = {
  user: PublicUser;
  role?: RoleType;
  leader?: boolean;
  co_leader?: boolean;
  groupName?: string;
};

const GroupMember = ({ user, role, leader, co_leader, groupName }: Props) => {
  const isReadme = groupName === 'readme';

  return (
    <a href={`/users/${user.username}`}>
      <Flex
        column
        gap="var(--spacing-xs)"
        alignItems="center"
        className={cx(
          styles.member,
          leader && styles.leader,
          co_leader && styles.coLeader,
        )}
      >
        <ProfilePicture user={user} size={90} />
        {leader && (
          <span className={styles.title}>
            {isReadme ? 'Redaktør' : ROLES['leader']}
          </span>
        )}
        {co_leader && (
          <span className={styles.title}>{ROLES['co-leader']}</span>
        )}
        {role && role !== 'member' && (
          <div className={styles.title}>{ROLES[role]}</div>
        )}
        <span className={styles.name}>{user.fullName}</span>
      </Flex>
    </a>
  );
};

export default GroupMember;
