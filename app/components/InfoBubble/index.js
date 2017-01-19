import React from 'react';
import styles from './InfoBubble.css';
import Icon from 'app/components/Icon';
import cx from 'classnames';

type Props = {
  icon: string,
  data: string,
  meta: string
};

const httpCheck = (link) => (link.startsWith('http://') ? link : `http://${link}`);

const noLinkIcon = (icon, bubbleClass, iconClass) => (
  <div className={cx(styles.bubble, bubbleClass)}>
    <Icon name={icon} className={cx(styles.icon, iconClass)} />
  </div>
);

const withLinkIcon = (link, icon, bubbleClass, iconClass) => (
  <a href={httpCheck(link)}>{noLinkIcon(icon, bubbleClass, iconClass)}</a>
);

const noLinkData = (dataClass, data, isMeta = false) => (
  <span className={cx(isMeta ? styles.meta : styles.data, dataClass)}>{data || '-'}</span>
);

const withLinkData = (link, dataClass, data) => (
  <a href={httpCheck(link)} style={{ margin: '0 auto' }}>{noLinkData(dataClass, data)}</a>
);

function InfoBubble({ icon, data, meta, className, bubbleClass, dataClass,
  metaClass, iconClass, link, ...props }: Props) {
  return (
    <div
      className={cx(styles.infoBubble, className)}
      {...props}
    >
      {link ? withLinkIcon(link, icon, bubbleClass, iconClass) :
        noLinkIcon(icon, bubbleClass, iconClass)}
      {link ? withLinkData(link, dataClass, data) : noLinkData(dataClass, data)}
      {noLinkData(metaClass, meta, true)}
    </div>
  );
}

export default InfoBubble;
