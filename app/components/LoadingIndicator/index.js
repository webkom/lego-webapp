// @flow

import React, { Component } from 'react';
import styles from './LoadingIndicator.css';

type Props = {
  loading: boolean,
  small?: boolean,
  loadingStyle?: Object,
  children?: any
};

export default class LoadingIndicator extends Component {
  props: Props;

  static defaultProps = {
    loading: false
  };

  render() {
    const spinnerStyle = this.props.small ? styles.small : styles.spinner;
    if (this.props.loading) {
      return (
        <div className={spinnerStyle} style={this.props.loadingStyle}>
          <div className={styles.bounce1} />
          <div className={styles.bounce2} />
        </div>
      );
    }

    return this.props.children ? <div>{this.props.children}</div> : null;
  }
}
