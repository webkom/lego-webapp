//@flow
import React from 'react';
import styles from './SocialMediaItem.css';
import Icon from 'app/components/Icon';

type Props = {
  socialMediaLink: string,
  textInfo: string,
  socialMediaName?: any,
  icon: string
};

const SocialMediaItem = ({
  socialMediaLink,
  textInfo,
  socialMediaName,
  icon
}: Props) => {
  return (
    <div className={styles.container}>
      <Icon name={icon} prefix="ion-logo-" size={40} />
      <div className={styles.textAndLink}>
        <div className={styles.textInfo}>{textInfo}</div>
        {socialMediaLink && <a href={socialMediaLink}>{icon}</a>}
        <div className={styles.textInfo}>{socialMediaName}</div>
      </div>
    </div>
  );
};

export default SocialMediaItem;
