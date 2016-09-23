// @flow

import React, { Component } from 'react';
import styles from './LoadingIndicator.css';

type Props = {
  loading: boolean,
  children?: any
};

export default class LoadingIndicator extends Component {
  props: Props;

  static defaultProps = {
    loading: false
  };

  render() {
    if (this.props.loading) {
      return (
        <div className={styles.spinner}>
          <div className={styles.bounce1} />
          <div className={styles.bounce2} />
        </div>
      );
    }

    return this.props.children ?
      <div>{this.props.children}</div> : null;
  }
}
