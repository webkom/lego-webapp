import React, { Component, PropTypes } from 'react';
import styles from './joblistings.css';
import Joblisting from './Joblisting';

export default class JoblistingsPage extends Component {

  static propTypes = {
    joblistings: PropTypes.array.isRequired
  };

  render() {
    console.log(this.props.joblistings);
    return (
      <div className={styles.root}>
        <h1>Jobbannonser</h1>
        <ul>
          {this.props.joblistings.map((joblisting, i) =>
            <Joblisting
              joblisting={joblisting}
              key={i}
            />
          )}
        </ul>
      </div>
    );
  }
}
