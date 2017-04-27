import React from 'react';
import Helmet from 'react-helmet';
import styles from './JoblistingsPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingsList';
import JoblistingsRightNav from './JoblistingsRightNav';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

type Props = {
  joblistings: Array,
  query: Object,
  actionGrant: Array
};

const JoblistingsPage = ({ joblistings, query, actionGrant }: Props) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <Helmet title="Karriere" />
      <FlexRow className={styles.page}>
        <FlexColumn className={styles.list}>
          <JoblistingsList joblistings={joblistings} />
        </FlexColumn>
        <FlexColumn className={styles.rightNav}>
          <JoblistingsRightNav query={query} actionGrant={actionGrant} />
        </FlexColumn>
      </FlexRow>
    </div>
  );
};

export default JoblistingsPage;
