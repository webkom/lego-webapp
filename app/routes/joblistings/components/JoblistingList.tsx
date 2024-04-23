import { Flex, Skeleton } from '@webkom/lego-bricks';
import JoblistingItem from 'app/components/JoblistingItem';
import sharedStyles from 'app/components/JoblistingItem/JoblistingItem.css';
import { useAppSelector } from 'app/store/hooks';
import styles from './JoblistingList.css';
import type { ListJoblisting } from 'app/store/models/Joblisting';

type JobListingsListProps = {
  joblistings: ListJoblisting[];
};

const JoblistingsList = ({ joblistings }: JobListingsListProps) => {
  const fetching = useAppSelector((state) => state.joblistings.fetching);

  return (
    <div className={styles.joblistingList}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        className={styles.heading}
      >
        <h2>Jobbannonser</h2>
        <h4 className={styles.headingDeadline}>Søknadsfrist</h4>
      </Flex>

      <Flex column gap="var(--spacing-sm)">
        {fetching && !joblistings.length ? (
          <Skeleton array={5} className={sharedStyles.joblistingItem} />
        ) : (
          joblistings.map((joblisting) => (
            <JoblistingItem key={joblisting.id} joblisting={joblisting} />
          ))
        )}
      </Flex>
    </div>
  );
};

export default JoblistingsList;
