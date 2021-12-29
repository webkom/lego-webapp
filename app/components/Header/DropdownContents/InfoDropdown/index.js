// @flow

import Icon from 'app/components/Icon';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './InfoDropdown.css';
import shared from 'app/components/Header/Header.css';

const options = [
  {
    to: '/pages/info-om-abakus',
    title: 'Generelt',
    text: 'Alt du trenger å vite om landets beste linjeforening',
  },
  {
    to: '/pages/bedrifter/for-bedrifter',
    title: 'For bedrifter',
    text: 'Les om hva vi kan tilby din bedrift',
  },
  {
    to: '/pages/grupper/39-praktisk-informasjon',
    title: 'Interessegrupper',
    text: 'På utgikk etter nye venner eller interesser?',
  },
  {
    to: '/pages/grupper/31-undergrupper',
    title: 'Undergrupper',
    text: 'Glad i å spille fotball eller game natten lang?',
  },
  {
    to: '/pages/generelt/104-revyen',
    title: 'Abakusrevyen',
    text: 'Visste du at Abakus har sin helt egen revy?',
  },
  {
    to: '/pages/komiteer',
    title: 'Komiteer',
    text: 'Ni ulike komiteer, men ett felles mål ...',
  },
];

const InfoDropdown = () => (
  <div className={styles.infoDropdownEl}>
    <div
      className={cx(shared.dropdownSection, styles.gridSection)}
      data-first-dropdown-section
    >
      {options.map((option) => {
        return (
          <NavLink
            to={option.to}
            className={styles.dropdownLink}
            activeClassName={styles.activeDropdownLink}
          >
            <div>
              <span>{option.title}</span>
              <Icon name="arrow-forward" size={20} />
            </div>
            <p>{option.text}</p>
          </NavLink>
        );
      })}
    </div>
    <div className={shared.dropdownSection}>
      <Link className={shared.bottomLink} to="/contact">
        Kontakt oss
      </Link>
    </div>
  </div>
);

export default InfoDropdown;
