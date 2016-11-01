import React, { Component, PropTypes } from 'react';
import styles from './JoblistingsPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingsList';

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
        <JoblistingsList
          joblistings = {joblistings}
        />
      </div>
    );
  }
}
