import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './Registrations.css';

const RegisteredCell = ({ user }) =>
  <Tooltip className={styles.cell} content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={60} user={user} />
    </Link>
  </Tooltip>;

export default RegisteredCell;
