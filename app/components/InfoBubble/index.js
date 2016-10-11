import React, { Component } from 'react';
import styles from './infoBubble.css';

type Props = {
  icon: string,
  data: string,
  meta: string,
  style: Object
};

export default class InfoBubble extends Component {

  props: Props;

  render() {
    const { icon, data, meta, style } = this.props;

    return (
      <div className={styles.infoBubble} style={style}>
        <div className={styles.bubble}>
          <span className={styles.circle}><i className='fa fa-circle'></i></span>
          <span className={styles.icon}>{icon ? (<i className={`fa fa-${icon}`}></i>) : '-'}</span>
        </div>
        <span className={styles.data}>{data || '-'}</span>
        <span className={styles.meta}>{meta || '-'}</span>
      </div>
    );
  }
}
