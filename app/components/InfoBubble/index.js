import React from 'react';
import styles from './InfoBubble.css';
import Icon from 'app/components/Icon';
import cx from 'classnames';

type Props = {
  /** Icon name */
  icon: string,
  /** Text under icon */
  data: string,
  /** Small text below main text */
  meta?: string,
  /** Size of button */
  small?: boolean,
  /** Make link a clickable link - url */
  link?: string
};

const httpCheck = link =>
  link.startsWith('http://') ? link : `http://${link}`;

const iconComponent = (icon, bubbleClass, iconClass, link = undefined) => {
  if (link) {
    return (
      <div className={bubbleClass}>
        <a href={httpCheck(link)} className={styles.iconLink}>
          <Icon name={icon} className={iconClass} size={30} />
        </a>
      </div>
    );
  }
  return (
    <div className={bubbleClass}>
      <Icon name={icon} className={iconClass} size={30} />
    </div>
  );
};

const dataComponent = (dataClass, data, link = undefined) => {
  if (link) {
    return (
      <a href={httpCheck(link)}>
        <span className={dataClass}>
          {data || '-'}
        </span>
      </a>
    );
  }
  return (
    <span className={dataClass}>
      {data || '-'}
    </span>
  );
};

function InfoBubble({
  icon,
  data,
  meta,
  className,
  small = false,
  link,
  ...props
}: Props) {
  const bubbleClass = small ? styles.smallBubble : styles.bubble;
  const iconClass = small ? styles.smallIcon : styles.icon;
  const dataClass = small ? styles.smallData : styles.data;
  const metaClass = small ? styles.smallMeta : styles.meta;

  return (
    <div className={cx(styles.infoBubble, className)} {...props}>
      {iconComponent(icon, bubbleClass, iconClass, link)}
      {dataComponent(dataClass, data, link)}
      {meta && dataComponent(metaClass, meta)}
    </div>
  );
}

export default InfoBubble;
