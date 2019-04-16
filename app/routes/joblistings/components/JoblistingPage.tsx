

import React from 'react';
import Helmet from 'react-helmet';
import styles from './JoblistingPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingList';
import JoblistingsRightNav from './JoblistingRightNav';
import { Flex } from 'app/components/Layout';

type Props = {
  joblistings: Array</*TODO: JobListing*/ any>,
  query: Object,
  actionGrant: /*TODO: ActionGrant */ any,
  router: any
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
      <Flex className={styles.page}>
        <JoblistingsList joblistings={joblistings} />
        <JoblistingsRightNav
          query={query}
          actionGrant={actionGrant}
          router={router}
        />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
