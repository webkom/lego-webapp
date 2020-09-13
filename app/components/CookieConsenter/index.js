// @flow

import React from 'react';
import styles from './index.css';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import CookieConsent from 'react-cookie-consent';

type Props = {
  content: string,
  buttonText?: string,
  link?: string,
};

const CookieConsenter = ({ content, buttonText, link }: Props) => {
  return (
    <CookieConsent
      style={{ background: '#bc1818' }}
      buttonStyle={{ background: 'white', borderRadius: '5px' }}
      buttonText={buttonText}
    >
      {content + ' '}
      {link ? (
        <NavigationLink to={'/' + link}>
          <span>
            Les mer <u>her</u>.
          </span>
        </NavigationLink>
      ) : (
        ''
      )}
    </CookieConsent>
  );
};

export default CookieConsenter;
