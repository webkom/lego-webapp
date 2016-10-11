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
      <div className={styles.bubble}>
        <span className={styles.circle}><Icon name={'circle'} className={styles.abaRed}/></span>
        <span className={styles.icon}>{icon ? (<i className={`fa fa-${icon}`}></i>) : '-'}</span>
      </div>
      <span className={styles.data}>{data || '-'}</span>
      <span className={styles.meta}>{meta || '-'}</span>
    </div>
  );
}

export default InfoBubble;
