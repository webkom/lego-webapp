import { Flex, Icon, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Facebook, Instagram, Linkedin, Slack } from 'lucide-react';
import moment from 'moment-timezone';
import bekk from '~/assets/bekk_short_white.svg';
import octocat from '~/assets/octocat.png';
import { useIsLoggedIn } from '~/redux/slices/auth';
import utilityStyles from '~/styles/utilities.module.css';
import Circle from '../Circle';
import styles from './Footer.module.css';

const Footer = () => {
  const loggedIn = useIsLoggedIn();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={cx(styles.section, utilityStyles.hiddenOnMobile)}>
          <a href="https://github.com/webkom" className={styles.gitHubLink}>
            <h2 className={styles.subHeader}>LEG</h2>
            <Image alt="Octocat" className={styles.octocat} src={octocat} />
            <p>av Webkom</p>
          </a>
          <p>
            Er du interessert i hvordan LEGO fungerer, eller vil du rapportere
            en bug? I så fall kan du gå inn på vår GitHub. Her tar vi gjerne
            imot både issues og pull requests!
          </p>
          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.legoLinks}
          >
            <a
              href="https://github.com/webkom/lego-webapp"
              rel="noopener noreferrer"
              target="_blank"
            >
              Frontend
            </a>
            <Circle
              size="var(--spacing-xs)"
              color="var(--color-absolute-white)"
            />
            <a
              href="https://github.com/webkom/lego"
              rel="noopener noreferrer"
              target="_blank"
            >
              Backend
            </a>
            <Circle
              size="var(--spacing-xs)"
              color="var(--color-absolute-white)"
            />
            <a
              href="https://webkom.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Utviklerbloggen
            </a>
          </Flex>
        </div>

        <div className={cx(styles.section, styles.rightSection)}>
          <h2 className={styles.subHeader}>Kontakt oss</h2>
          <p>
            Abakus <br />
            Sem Sælands vei 7-9 <br />
            7491 Trondheim
          </p>
          {loggedIn && <a href="/contact">Kontaktskjema</a>}
          <a
            href="https://avvik.abakus.no"
            rel="noopener noreferrer"
            target="_blank"
          >
            Varslingsportal
          </a>
          <a href="mailto:abakus@abakus.no">abakus@abakus.no</a>
          <div className={styles.socialMedia}>
            {loggedIn && (
              <a
                href="https://join.slack.com/t/abakus-ntnu/shared_invite/zt-19m96d1du-WoVE99K20g5iUeKaTGSVxw"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon iconNode={<Slack />} className={styles.socialMediaIcon} />
              </a>
            )}
            <a
              href="https://www.facebook.com/AbakusNTNU/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon
                iconNode={<Facebook />}
                className={styles.socialMediaIcon}
              />
            </a>
            <a
              href="https://www.instagram.com/AbakusNTNU/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon
                iconNode={<Instagram />}
                className={styles.socialMediaIcon}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/abakus_3/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon
                iconNode={<Linkedin />}
                className={styles.socialMediaIcon}
              />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomContent}>
          <a href="https://www.bekk.no/" target="blank">
            <Image
              className={styles.cooperator}
              src={bekk}
              alt="Bekk sin logo"
            />
          </a>
          <a href="/pages/personvern/114-informasjonskapsler">
            Informasjonskapsler (cookies)
          </a>
          <a href="/pages/personvern/124-personvernserklring">
            Personvernerklæring
          </a>
          <span>© {moment().year()} Abakus</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
