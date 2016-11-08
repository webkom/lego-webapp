import React from 'react';
import styles from './InfoBubble.css';
import Icon from 'app/components/Icon';
import cx from 'classnames';

type Props = {
  icon: string,
  data: string,
  meta: string
};

function InfoBubble({ icon, data, meta, className, ...props }: Props) {
  return (
    <div
      className={cx(styles.infoBubble, className)}
      {...props}
    >
      <div className={styles.bubble}><Icon name={icon} className={styles.icon} /></div>
      <span className={styles.data}>{data || '-'}</span>
      <span className={styles.meta}>{meta || '-'}</span>
    </div>
  );
}

export default InfoBubble;
