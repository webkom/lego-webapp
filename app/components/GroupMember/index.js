// @flow

import React from 'react';
import styles from './GroupMember.css';
import { Link } from 'react-router';
import cx from 'classnames';
import type { User } from 'app/models';

type Props = {
  user: User,
  profilePicture: string,
  leader?: boolean
};
const GroupMember = ({ user, profilePicture, leader }: Props) => {
  return (
    <Link to={`/users/${user.username}`}>
      <div className={cx(styles.member, leader && styles.leader)}>
        <img alt="profilePicture" src={user.profilePicture} />
        {leader && <div className={styles.title}>LEDER</div>}
        <div className={styles.name}>{user.fullName}</div>
      </div>
    </Link>
  );
};

export default GroupMember;
