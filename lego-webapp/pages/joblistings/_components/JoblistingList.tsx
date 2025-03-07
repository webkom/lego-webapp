import {
  Button,
  Flex,
  Icon,
  Skeleton,
  useClearSearchParams,
} from '@webkom/lego-bricks';
import { FilterX, FolderOpen } from 'lucide-react';
import EmptyState from '~/components/EmptyState';
import JoblistingItem from '~/components/JoblistingItem';
import sharedStyles from '~/components/JoblistingItem/JoblistingItem.module.css';
import { useAppSelector } from '~/redux/hooks';
import styles from './JoblistingList.module.css';
import type { ListJoblisting } from '~/redux/models/Joblisting';

type JobListingsListProps = {
  joblistings: ListJoblisting[];
  totalCount: number;
};

const JoblistingsList = ({ joblistings, totalCount }: JobListingsListProps) => {
  const fetching = useAppSelector((state) => state.joblistings.fetching);
  const clearSearchParams = useClearSearchParams();

  if (joblistings.length === 0 && !fetching) {
    return (
      <EmptyState
        iconNode={<FolderOpen />}
        header="Her var det tomt ..."
        body={
          <>
            Ingen jobbannonser {totalCount > 0 && 'som matcher ditt filter'}{' '}
            ligger
            {totalCount === 0 && ' for øyeblikket'} ute
            {totalCount > 0 && (
              <Button flat onPress={clearSearchParams}>
                <Icon iconNode={<FilterX />} size={22} />
                Tøm filter
              </Button>
            )}
          </>
        }
        className={styles.emptyState}
      />
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
