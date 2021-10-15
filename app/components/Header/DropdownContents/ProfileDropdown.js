import React from 'react';
import styles from '../Header.css';

const ProfileDropdown = () => {
  return (
    <div className={styles.profileDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
        <div>Ola Nordmann</div>
        <div>Innstillinger</div>
        <div>Møteinnkallinger</div>
      </div>
      <div className={styles.dropdownSection}>
        <div>Logg ut</div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
