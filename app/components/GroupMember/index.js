// @flow

import { Link } from 'react-router-dom';
import cx from 'classnames';

import { Image } from 'app/components/Image';
import type { User } from 'app/models';

import styles from './GroupMember.css';

type Props = {
  user: User,
  leader?: boolean,
  co_leader?: boolean,
};

const GroupMember = ({ user, leader, co_leader }: Props) => {
  return (
    <Link to={`/users/${user.username}`}>
      <div
        className={cx(
          styles.member,
          leader && styles.leader,
          co_leader && styles.coLeader
        )}
      >
        <Image
          alt="profilePicture"
          src={user.profilePicture}
          placeholder={user.profilePicturePlaceholder}
        />
        {leader && <div className={styles.title}>LEDER</div>}
        {co_leader && <div className={styles.title}>NESTLEDER</div>}
        <div className={styles.name}>{user.fullName}</div>
      </div>
    </Link>
  );
};

export default GroupMember;
