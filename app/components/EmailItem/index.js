import React from 'react';
import styles from './EmailItem.css';

const EmailItem = ({ email, logo, recipient }) => {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logo} alt={recipient + ' logo'} />
      <div>
        <div className={styles.recipient}>{recipient}</div>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </div>
  );
};

export default EmailItem;
