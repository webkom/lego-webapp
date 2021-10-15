import React from 'react';
import styles from '../Header.css';

const InfoDropdown = () => {
  return (
    <div className={styles.infoDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
        <div>Generelt</div>
        <div>For bedrifter</div>
        <div>Arrangementer</div>
        <div>Komiteer</div>
        <div>Grupper</div>
      </div>
      <div className={styles.dropdownSection}>
        <div>Kontakt oss</div>
      </div>
    </div>
  );
};

export default InfoDropdown;
