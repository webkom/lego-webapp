import JoblistingItem from 'app/components/JoblistingItem';
import { Flex } from 'app/components/Layout';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import styles from './JoblistingList.module.css';

type JobListingsListProps = {
  joblistings: ListJoblisting[];
};

const JoblistingsList = ({ joblistings }: JobListingsListProps) => (
  <Flex column className={styles.joblistingList}>
    <Flex className={styles.heading}>
      <h2 className={styles.headingText}>Jobbannonser</h2>
      <h4 className={styles.headingDeadline}>Søknadsfrist:</h4>
    </Flex>
    {joblistings.map((joblisting) => (
      <JoblistingItem key={joblisting.id} joblisting={joblisting} />
    ))}
  </Flex>
);

export default JoblistingsList;
