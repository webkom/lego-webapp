// @flow

import React from 'react';
import cx from 'classnames';
import RandomQuote from '../RandomQuote';
import Flex from 'app/components/Layout/Flex';
import { hiddenOnMobile } from 'app/styles/utilities.css';
import { Image } from 'app/components/Image';
import { Link } from 'react-router';
import netcompany from 'app/assets/netcompany_white.svg';
import Octocat from 'app/assets/Octocat.png';
import Icon from 'app/components/Icon';
import styles from './Footer.css';

type Props = {
  loggedIn: boolean
};

const Footer = (props: Props) => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <Flex column>
        <Flex>
          <div className={cx(styles.section, hiddenOnMobile)}>
            <a
              href="https://github.com/webkom"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image className={styles.octocat} src={Octocat} />
            </a>
            <h2>LEGO</h2>
            <p>
              Velkommen til LEGO, Abakus sin open-source nettside. Webkom har
              arbeidet lenge med denne siden, og håper den faller i smak. Er du
              interessert i hvordan LEGO fungerer, eller vil du rapportere en
              bug, kan du gå inn på vår GitHub. Her tar vi gjerne imot issues og
              pull-requests.
              <br />
              <a
                href="https://github.com/webkom/lego-webapp"
                rel="noopener noreferrer"
                target="_blank"
              >
                LEGO FRONTEND
              </a>
              <br />
              <a
                href="https://github.com/webkom/lego"
                rel="noopener noreferrer"
                target="_blank"
              >
                LEGO BACKEND
              </a>
            </p>
          </div>
          <div className={cx(styles.section, hiddenOnMobile)}>
            <Link to={'/quotes/?filter=all'} style={{ color: 'white' }}>
              <Icon
                className={styles.contact}
                size={50}
                name="contacts-outline"
              />
            </Link>
            <div>temp footer content</div>
            {
              //
              // <div>
              //   <h3>Sitat</h3>
              //   <RandomQuote loggedIn={props.loggedIn} />
              // </div>
            }
          </div>
          <div className={styles.section}>
            <Icon
              className={styles.contact}
              size={50}
              name="chatbubbles-outline"
            />
            <h2>Kontakt</h2>
            <a href="mailto:abakus@abakus.no">abakus@abakus.no</a>
            <p>Abakus</p>
            <p>Sem Sælands vei 7-9</p>
            <p>7491 Trondheim</p>
          </div>
        </Flex>
        <Image className={styles.cooperator} src={netcompany} />
      </Flex>
    </div>
  </footer>
);

export default Footer;
