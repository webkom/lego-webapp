import React from 'react';
import styles from './JoblistingsPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingsList';
import JoblistingsRightNav from './JoblistingsRightNav';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

const JoblistingsPage = ({ joblistings, query }) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <FlexRow className={styles.page} >
        <FlexColumn className={styles.list}>
          <JoblistingsList
            joblistings={joblistings}
          />
        </FlexColumn>
        <FlexColumn className={styles.rightNav}>
          <JoblistingsRightNav
            query={query}
          />
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingsPage;
