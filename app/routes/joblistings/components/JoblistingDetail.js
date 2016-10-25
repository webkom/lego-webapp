import React, { Component, PropTypes } from 'react';
import styles from './joblistings.css';

export default class JoblistingDetail extends Component {

  static propTypes = {
    joblisting: PropTypes.object.isRequired
  };

  render() {
    const { joblisting } = this.props;
    console.log(joblisting);
    return (
      <div className={styles.root}>
        <h1>{joblisting.title}</h1>
      </div>
    );
  }
}
