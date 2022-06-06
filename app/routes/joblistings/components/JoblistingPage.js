// @flow

import { Helmet } from 'react-helmet-async';
import styles from './JoblistingPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import JoblistingsList from './JoblistingList';
import JoblistingsRightNav from './JoblistingRightNav';
import { Flex } from 'app/components/Layout';
import type { ActionGrant } from 'app/models';

type Props = {
  joblistings: Array</*TODO: JobListing*/ any>,
  search: Object,
  actionGrant: ActionGrant,
  history: Object,
};

const JoblistingsPage = ({
  joblistings,
  search,
  actionGrant,
  history,
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
