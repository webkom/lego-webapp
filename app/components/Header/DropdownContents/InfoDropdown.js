// @flow

import styles from '../Header.css';

const InfoDropdown = () => (
  <div className={styles.infoDropdownEl}>
    <div className={styles.dropdownSection} data-first-dropdown-section>
      <div>
        <div>
          <h4>Generelt</h4>
          <p>lorem ipsum</p>
        </div>
        <div>
          <h4>For bedrifter</h4>
          <p>lorem upsum</p>
        </div>
      </div>
      <div>
        <div>
          <h4>Komiteer</h4>
          <p>lorem ipsum</p>
        </div>
        <div>
          <h4>Interessegrupper</h4>
          <p>lroe umimspou</p>
        </div>
      </div>
      <div>
        <div>
          <h4>Undergrupper</h4>
          <p>undergrupper er</p>
        </div>
        <div>
          <h4>AbakusRevyen</h4>
          <p>Abakus</p>
        </div>
      </div>
    </div>
    <div className={styles.dropdownSection}>
      <a className={styles.altText} href="/contact">
        Kontakt oss
      </a>
    </div>
  </div>
);

export default InfoDropdown;
