import React, { Component, PropTypes } from 'react';
import styles from './JoblistingsPage.css';
import Joblisting from './Joblisting';
import LoadingIndicator from 'app/components/LoadingIndicator/';

export default class JoblistingsPage extends Component {

  static propTypes = {
    joblistings: PropTypes.array.isRequired
  };

  render() {
    const { joblistings } = this.props;
    if (!joblistings) {
      return <LoadingIndicator loading />;
    }
    return (
      <div className={styles.root}>
        <h1>Jobbannonser</h1>
        <ul>
          {joblistings.map((joblisting) =>
            <Joblisting
              {...this.props}
              joblisting={joblisting}
              key={joblisting.id}
            />
          )}
        </ul>
      </div>
    );
  }
}
