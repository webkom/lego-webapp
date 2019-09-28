// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './JoblistingPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingList';
import JoblistingsRightNav from './JoblistingRightNav';
import { Flex } from 'app/components/Layout';

type Props = {
  joblistings: Array</*TODO: JobListing*/ any>,
  search: Object,
  actionGrant: /*TODO: ActionGrant */ any,
  history: Object
};

const JoblistingsPage = ({
  joblistings,
  search,
  actionGrant,
  history
}: Props) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <Helmet title="Karriere" />
      <Flex className={styles.page}>
        <JoblistingsList joblistings={joblistings} />
        <JoblistingsRightNav
          query={search}
          actionGrant={actionGrant}
          history={history}
        />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
