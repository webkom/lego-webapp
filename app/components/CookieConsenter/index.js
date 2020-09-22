// @flow
import React from 'react';
import styles from './index.css';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import Button from 'app/components/Button';

type Props = {
  content: string,
  link: string,
  buttonText?: string,
  consentAction: any,
};

const CookieConsenter = ({
  content,
  buttonText,
  link,
  consentAction,
}: Props) => {
  return (
    <div className={styles.cookieBanner}>
      <div className={styles.content}>
        {content + ' '}
        <NavigationLink to={'/' + link}>
          <span className={styles.styledLink}>
            Les mer <u>her</u>.
          </span>
        </NavigationLink>
      </div>
      <Button onClick={consentAction}>{buttonText}</Button>
    </div>
  );
};

export default CookieConsenter;
