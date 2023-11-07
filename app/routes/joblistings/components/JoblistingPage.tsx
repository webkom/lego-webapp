import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import JoblistingsList from './JoblistingList';
import styles from './JoblistingPage.css';
import JoblistingsRightNav from './JoblistingRightNav';
import type { ActionGrant } from 'app/models';
import type { ListJoblisting } from 'app/store/models/Joblisting';

type Props = {
  joblistings: ListJoblisting[];
  actionGrant: ActionGrant;
};

const JoblistingsPage = ({ joblistings, actionGrant }: Props) => {
  if (!joblistings) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <Helmet title="Karriere" />
      <Flex className={styles.page}>
        <JoblistingsList joblistings={joblistings} />
        <JoblistingsRightNav actionGrant={actionGrant} />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
