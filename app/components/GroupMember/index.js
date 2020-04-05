// @flow

import React from 'react';
import styles from './GroupMember.css';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import type { User } from 'app/models';
import { Image } from 'app/components/Image';

type Props = {
  user: User,
  profilePicture: string,
  leader?: boolean,
  co_leader?: boolean
};
const GroupMember = ({ user, profilePicture, leader, co_leader }: Props) => {
  return (
    <Link to={`/users/${user.username}`}>
      <div
        className={cx(
          styles.member,
          leader && styles.leader,
          co_leader && styles.co_leader
        )}
      >
        <Image alt="profilePicture" src={user.profilePicture} />
        {leader && <div className={styles.title}>LEDER</div>}
        {co_leader && <div className={styles.title}>NESTLEDER</div>}
        <div className={styles.name}>{user.fullName}</div>
      </div>
    </Link>
  );
};

export default GroupMember;
