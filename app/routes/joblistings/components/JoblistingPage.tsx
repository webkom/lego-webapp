import { Helmet } from 'react-helmet-async';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import type { ActionGrant } from 'app/models';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import JoblistingsList from './JoblistingList';
import styles from './JoblistingPage.module.css';
import JoblistingsRightNav from './JoblistingRightNav';

type Props = {
  joblistings: ListJoblisting[];
  search: {
    grades?: string;
    jobTypes?: string;
    workplaces?: string;
    order?: string;
  };
  actionGrant: ActionGrant;
  history: Record<string, any>;
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
