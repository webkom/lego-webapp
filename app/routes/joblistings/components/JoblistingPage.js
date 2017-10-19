// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './JoblistingPage.css';
import { Content } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingList';
import JoblistingsRightNav from './JoblistingRightNav';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

type Props = {
  joblistings: Array</*TODO: JobListing*/ any>,
  query: Object,
  actionGrant: /*TODO: ActionGrant */ any
};

const JoblistingsPage = ({ joblistings, query, actionGrant }: Props) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }
  return (
    <Content>
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
    </Content>
  );
};

export default JoblistingsPage;
