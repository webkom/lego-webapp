// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './JoblistingPage.css';
import { Content } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingList';
import JoblistingsRightNav from './JoblistingRightNav';
import { Flex } from 'app/components/Layout';

type Props = {
  joblistings: Array</*TODO: JobListing*/ any>,
  query: Object,
  actionGrant: /*TODO: ActionGrant */ any
};

const JoblistingsPage = ({
  joblistings,
  query,
  actionGrant,
  router
}: Props) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <Helmet title="Karriere" />
      <Flex wrapReverse className={styles.page}>
        <JoblistingsList joblistings={joblistings} className={styles.list} />
        <JoblistingsRightNav
          query={query}
          actionGrant={actionGrant}
          className={styles.rightNav}
          router={router}
        />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
