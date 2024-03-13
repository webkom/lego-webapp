import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { ROLES, type RoleType } from 'app/utils/constants';
import styles from './GroupMember.css';
import type { PublicUser } from 'app/store/models/User';

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
    <Link to={`/users/${user.username}`}>
      <div
        className={cx(
          styles.member,
          leader && styles.leader,
          co_leader && styles.coLeader,
        )}
      >
        <Image
          alt="profilePicture"
          src={user.profilePicture}
          placeholder={user.profilePicturePlaceholder}
        />
        {leader && (
          <div className={styles.title}>
            {isReadme ? 'Redaktør' : ROLES['leader']}
          </div>
        )}
        {co_leader && <div className={styles.title}>{ROLES['co-leader']}</div>}
        {role && role !== 'member' && (
          <div className={styles.title}>{ROLES[role]}</div>
        )}
        <div className={styles.name}>{user.fullName}</div>
      </div>
    </Link>
  );
};

export default GroupMember;
