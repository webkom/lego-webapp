import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './Registrations.css';

const RegisteredCell = ({ user }) => (
  <Tooltip className={styles.cell} content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={56} user={user} style={{ margin: '0px 2px' }} />
    </Link>
  </Tooltip>
);

export default RegisteredCell;
