import { Flex } from '@webkom/lego-bricks';
import JoblistingItem from 'app/components/JoblistingItem';
import styles from './JoblistingList.css';
import type { ListJoblisting } from 'app/store/models/Joblisting';

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
