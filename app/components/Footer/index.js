// @flow

import cx from 'classnames';
import utilityStyles from 'app/styles/utilities.css';
import { Image } from 'app/components/Image';
import netcompany from 'app/assets/netcompany_white.svg';
import octocat from 'app/assets/octocat.png';
import slack from 'app/assets/slack.png';
import facebook from 'app/assets/facebook.png';
import instagram from 'app/assets/instagram.png';
import styles from './Footer.css';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

type Props = {
  loggedIn: boolean,
};

const Footer = ({ loggedIn }: Props) => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={cx(styles.section, utilityStyles.hiddenOnMobile)}>
        <a
          href="https://github.com/webkom"
          rel="noopener noreferrer"
          target="_blank"
          className={styles.gitHubLink}
        >
          <span className={styles.subHeader}>LEG</span>
          <Image className={styles.octocat} src={octocat} />
        </a>
        <p>
          Er du interessert i hvordan LEGO fungerer, eller vil du rapportere en
          bug? I så fall kan du gå inn på vår GitHub. Her tar vi gjerne imot
          både issues og pull requests!
        </p>
        <div className={styles.legoLinks}>
          <a
            href="https://github.com/webkom/lego-webapp"
            rel="noopener noreferrer"
            target="_blank"
          >
            FRONTEND
          </a>
          <span className={styles.pipe}>|</span>
          <a
            href="https://github.com/webkom/lego"
            rel="noopener noreferrer"
            target="_blank"
          >
            BACKEND
          </a>
        </div>
      </div>
      <div className={cx(styles.section, styles.rightSection)}>
        <span className={styles.subHeader}>Kontakt oss</span>
        <p>
          Abakus <br />
          Sem Sælands vei 7-9 <br />
          7491 Trondheim
        </p>
        {loggedIn && <Link to="/contact">Anonymt kontaktskjema</Link>}
        <a href="mailto:abakus@abakus.no">abakus@abakus.no</a>
        <div className={styles.socialMedia}>
          {loggedIn && (
            <a
              href="https://abakus-ntnu.slack.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={slack}
                className={styles.socialMediaIcon}
                alt="slack"
              />
            </a>
          )}
          <a
            href="https://www.facebook.com/AbakusNTNU/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              src={facebook}
              className={styles.socialMediaIcon}
              alt="facebook"
            />
          </a>
          <a
            href="https://www.instagram.com/AbakusNTNU/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              src={instagram}
              className={styles.socialMediaIcon}
              alt="instagram"
            />
          </a>
        </div>
      </div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.bottomContent}>
        <Image
          className={styles.cooperator}
          src={netcompany}
          alt="netcompany"
        />
        <Link to="/pages/personvern/114-informasjonskapsler">
          Informasjonskapsler (cookies)
        </Link>
        <span>© {moment().year()} Abakus</span>
      </div>
    </div>
  </footer>
);

export default Footer;
