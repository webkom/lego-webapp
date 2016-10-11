import React from 'react';
import styles from './InfoBubble.css';
import Icon from 'app/components/Icon';

type Props = {
  icon: string,
  data: string,
  meta: string,
  style?: Object
};

function InfoBubble({ icon, data, meta, style }: Props) {
  return (
    <div className={styles.infoBubble} style={style}>
      <div className={styles.bubble}><Icon name={icon} className={styles.icon} /></div>
      <span className={styles.data}>{data || '-'}</span>
      <span className={styles.meta}>{meta || '-'}</span>
    </div>
  );
}

export default InfoBubble;
