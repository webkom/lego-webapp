import { Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import netcompany from 'app/assets/netcompany_white.svg';
import octocat from 'app/assets/octocat.png';
import { useIsLoggedIn } from 'app/reducers/auth';
import utilityStyles from 'app/styles/utilities.css';
import styles from './Footer.css';

const Footer = () => {
  const loggedIn = useIsLoggedIn();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={cx(styles.section, utilityStyles.hiddenOnMobile)}>
          <a
            href="https://github.com/webkom"
            rel="noopener noreferrer"
            target="_blank"
            className={styles.gitHubLink}
          >
            <h2 className={styles.subHeader}>LEG</h2>
            <Image alt="Octocat" className={styles.octocat} src={octocat} />
          </a>
          <p>
            Er du interessert i hvordan LEGO fungerer, eller vil du rapportere
            en bug? I så fall kan du gå inn på vår GitHub. Her tar vi gjerne
            imot både issues og pull requests!
          </p>
          <div className={styles.legoLinks}>
            <a
              href="https://github.com/webkom/lego-webapp"
              rel="noopener noreferrer"
              target="_blank"
            >
              FRONTEND
            </a>
            <b>|</b>
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
          <h2 className={styles.subHeader}>Kontakt oss</h2>
          <p>
            Abakus <br />
            Sem Sælands vei 7-9 <br />
            7491 Trondheim
          </p>
          {loggedIn && <Link to="/contact">Kontaktskjema</Link>}
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
                <svg
                  className={styles.socialMediaIcon}
                  version="1.1"
                  width="40px"
                  height="40px"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#5d0909"
                    d="M 8.405 25.274 C 8.399 27.593 6.524 29.474 4.205 29.48 C 1.881 29.474 0.006 27.599 0 25.274 C 0.006 22.955 1.889 21.08 4.205 21.075 L 8.405 21.075 Z M 10.52 25.274 C 10.526 22.955 12.409 21.08 14.726 21.075 C 17.038 21.08 18.92 22.955 18.925 25.274 L 18.925 35.795 C 18.92 38.111 17.045 39.994 14.726 40 C 12.401 39.994 10.526 38.111 10.52 35.795 Z M 14.726 8.405 C 12.408 8.399 10.526 6.524 10.52 4.205 C 10.526 1.889 12.401 0.006 14.726 0 C 17.045 0.006 18.92 1.889 18.925 4.205 L 18.925 8.405 Z M 14.726 10.52 C 17.045 10.526 18.92 12.401 18.925 14.726 C 18.92 17.045 17.045 18.92 14.726 18.925 L 4.205 18.925 C 1.889 18.92 0.006 17.045 0 14.726 C 0.006 12.401 1.889 10.526 4.205 10.52 Z M 31.595 14.726 C 31.601 12.401 33.476 10.526 35.795 10.52 C 38.111 10.526 39.994 12.401 40 14.726 C 39.994 17.045 38.111 18.92 35.795 18.925 L 31.595 18.925 Z M 29.48 14.726 C 29.474 17.045 27.591 18.92 25.274 18.925 C 22.955 18.92 21.08 17.039 21.075 14.726 L 21.075 4.205 C 21.08 1.889 22.955 0.006 25.274 0 C 27.599 0.006 29.474 1.881 29.48 4.205 Z M 25.274 31.595 C 27.599 31.595 29.474 33.476 29.48 35.795 C 29.474 38.119 27.599 39.994 25.274 40 C 22.955 39.994 21.08 38.111 21.075 35.795 L 21.075 31.595 Z M 25.274 29.48 C 22.955 29.474 21.08 27.591 21.075 25.274 C 21.08 22.955 22.955 21.08 25.274 21.075 L 35.795 21.075 C 38.111 21.08 39.994 22.955 40 25.274 C 39.994 27.599 38.119 29.474 35.795 29.48 Z"
                  />
                </svg>
              </a>
            )}
            <a
              href="https://www.facebook.com/AbakusNTNU/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className={styles.socialMediaIcon}
                version="1.1"
                width="40px"
                height="40px"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#5d0909"
                  d="M 32.5 0 C 34.566 0 36.332 0.734 37.799 2.201 C 39.266 3.668 40 5.434 40 7.5 L 40 32.5 C 40 34.566 39.266 36.332 37.799 37.799 C 36.332 39.266 34.566 40 32.5 40 L 27.604 40 L 27.604 24.505 L 32.786 24.505 L 33.568 18.464 L 27.604 18.464 L 27.604 14.609 C 27.604 13.637 27.808 12.908 28.216 12.422 C 28.624 11.936 29.418 11.693 30.599 11.693 L 33.776 11.667 L 33.776 6.276 C 32.682 6.12 31.137 6.042 29.141 6.042 C 26.78 6.042 24.891 6.736 23.477 8.125 C 22.062 9.514 21.354 11.476 21.354 14.01 L 21.354 18.464 L 16.146 18.464 L 16.146 24.505 L 21.354 24.505 L 21.354 40 L 7.5 40 C 5.434 40 3.668 39.266 2.201 37.799 C 0.734 36.332 0 34.566 0 32.5 L 0 7.5 C 0 5.434 0.734 3.668 2.201 2.201 C 3.668 0.734 5.434 0 7.5 0 L 32.5 0 Z"
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/AbakusNTNU/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className={styles.socialMediaIcon}
                version="1.1"
                width="40px"
                height="40px"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#5d0909"
                  d="M 13.335 20 C 13.335 16.318 16.319 13.333 20.001 13.333 C 23.683 13.333 26.668 16.318 26.668 20 C 26.668 23.682 23.683 26.667 20.001 26.667 C 16.319 26.667 13.335 23.682 13.335 20 M 9.731 20 C 9.731 25.672 14.329 30.27 20.001 30.27 C 25.673 30.27 30.271 25.672 30.271 20 C 30.271 14.328 25.673 9.73 20.001 9.73 C 14.329 9.73 9.731 14.328 9.731 20 M 28.277 9.323 C 28.277 10.648 29.352 11.724 30.678 11.724 C 32.003 11.724 33.079 10.648 33.079 9.323 C 33.079 7.998 32.005 6.924 30.678 6.924 C 29.352 6.924 28.277 7.998 28.277 9.323 M 11.92 36.279 C 9.97 36.191 8.91 35.866 8.206 35.591 C 7.272 35.228 6.606 34.795 5.905 34.095 C 5.205 33.396 4.771 32.73 4.409 31.796 C 4.134 31.092 3.81 30.032 3.721 28.082 C 3.624 25.974 3.604 25.341 3.604 20 C 3.604 14.659 3.625 14.027 3.721 11.918 C 3.81 9.968 4.136 8.91 4.409 8.204 C 4.772 7.27 5.205 6.604 5.905 5.903 C 6.604 5.204 7.27 4.769 8.206 4.407 C 8.91 4.132 9.97 3.808 11.92 3.719 C 14.028 3.622 14.661 3.603 20.001 3.603 C 25.342 3.603 25.974 3.624 28.084 3.719 C 30.034 3.808 31.092 4.134 31.798 4.407 C 32.732 4.769 33.397 5.204 34.098 5.903 C 34.798 6.603 35.231 7.27 35.594 8.204 C 35.869 8.908 36.194 9.968 36.283 11.918 C 36.38 14.027 36.399 14.659 36.399 20 C 36.399 25.339 36.38 25.973 36.283 28.082 C 36.194 30.032 35.867 31.092 35.594 31.796 C 35.231 32.73 34.798 33.396 34.098 34.095 C 33.399 34.795 32.732 35.228 31.798 35.591 C 31.093 35.866 30.034 36.191 28.084 36.279 C 25.975 36.376 25.342 36.396 20.001 36.396 C 14.661 36.396 14.028 36.376 11.92 36.279 M 11.755 0.121 C 9.626 0.218 8.172 0.556 6.9 1.05 C 5.585 1.561 4.47 2.246 3.357 3.357 C 2.246 4.468 1.561 5.583 1.05 6.9 C 0.556 8.171 0.218 9.625 0.121 11.754 C 0.023 13.887 0 14.569 0 20 C 0 25.431 0.023 26.113 0.121 28.246 C 0.218 30.375 0.556 31.829 1.05 33.1 C 1.561 34.415 2.244 35.532 3.357 36.643 C 4.469 37.754 5.583 38.438 6.9 38.95 C 8.173 39.444 9.626 39.782 11.755 39.879 C 13.889 39.976 14.569 40 20.001 40 C 25.434 40 26.114 39.977 28.247 39.879 C 30.376 39.782 31.83 39.444 33.102 38.95 C 34.417 38.438 35.531 37.754 36.644 36.643 C 37.756 35.532 38.439 34.415 38.951 33.1 C 39.446 31.829 39.785 30.375 39.88 28.246 C 39.977 26.111 40 25.431 40 20 C 40 14.569 39.977 13.887 39.88 11.754 C 39.784 9.625 39.446 8.171 38.951 6.9 C 38.439 5.585 37.756 4.47 36.644 3.357 C 35.533 2.246 34.417 1.561 33.103 1.05 C 31.83 0.556 30.376 0.216 28.248 0.121 C 26.116 0.024 25.434 0 20.002 0 C 14.569 0 13.889 0.023 11.755 0.121"
                />
              </svg>
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
          <Link to="/pages/personvern/124-personvernserklring">
            Personvernerklæring
          </Link>
          <span>© {moment().year()} Abakus</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
