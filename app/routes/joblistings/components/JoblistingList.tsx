import { Button, Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import { FilterX } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import JoblistingItem from 'app/components/JoblistingItem';
import sharedStyles from 'app/components/JoblistingItem/JoblistingItem.css';
import { useAppSelector } from 'app/store/hooks';
import styles from './JoblistingList.css';
import type { ListJoblisting } from 'app/store/models/Joblisting';

type JobListingsListProps = {
  joblistings: ListJoblisting[];
  totalCount: number;
};

const JoblistingsList = ({ joblistings, totalCount }: JobListingsListProps) => {
  const fetching = useAppSelector((state) => state.joblistings.fetching);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const clearQueryParams = () => {
    navigate(pathname);
  };

  if (joblistings.length === 0 && !fetching) {
    return (
      <EmptyState icon="folder-open-outline" className={styles.emptyState}>
        <b>Her var det tomt ...</b>
        Ingen jobbannonser {totalCount > 0 && 'som matcher ditt filter'} ligger
        {totalCount === 0 && ' for øyeblikket'} ute
        {totalCount > 0 && (
          <Button flat onPress={clearQueryParams}>
            <Icon iconNode={<FilterX />} size={22} />
            Tøm filter
          </Button>
        )}
      </EmptyState>
    );
  }

  return (
    <Flex column gap="var(--spacing-sm)">
      {fetching && !joblistings.length ? (
        <Skeleton array={5} className={sharedStyles.joblistingItem} />
      ) : (
        joblistings.map((joblisting) => (
          <JoblistingItem key={joblisting.id} joblisting={joblisting} />
        ))
      )}
    </Flex>
  );
};

export default JoblistingsList;
