import styles from './Registrations.css';
import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';

const RegisteredCell = ({ user }) => (
  <Tooltip className={styles.cell} content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <img
        src={`http://api.adorable.io/avatars/${user.username}.png`}
      />
    </Link>
  </Tooltip>
);

export default RegisteredCell;
