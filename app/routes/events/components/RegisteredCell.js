// @flow

import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { ProfilePicture } from 'app/components/Image';
import styles from './Registrations.css';
import type { User } from 'app/models';

type Props = {
  user: User
};

const RegisteredCell = ({ user }: Props) => (
  <Tooltip className={styles.cell} content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={56} user={user} style={{ margin: '0px 2px' }} />
    </Link>
  </Tooltip>
);

export default RegisteredCell;
