import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Leaf } from 'lucide-react';
import PillSwitch, { type PillSwitchOption } from '~/components/PillSwitch';
import EmptyState from '../../components/EmptyState';
import LendingRequestCard from './LendingRequestCard';
import styles from './RequestInbox.module.css';
import { canLoadMoreRequests } from './requestInboxPagination';
import type { TransformedLendingRequest } from '~/redux/models/LendingRequest';

export type LendingRequestOrdering = 'created_at' | '-created_at';

const orderingOptions: PillSwitchOption<LendingRequestOrdering>[] = [
  { label: 'Nyeste', value: '-created_at' },
  { label: 'Eldste', value: 'created_at' },
];

type Props = {
  lendingRequests: TransformedLendingRequest[];
  totalFetched: number;
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  ordering: LendingRequestOrdering;
  onOrderingChange: (ordering: LendingRequestOrdering) => void;
  className?: string;
};

const RequestInbox = ({
  lendingRequests,
  totalFetched,
  isFetching,
  hasMore,
  onLoadMore,
  ordering,
  onOrderingChange,
  className,
}: Props) => {
  const hasRequests = lendingRequests.length > 0;
  const canLoadMore = canLoadMoreRequests({
    hasMore,
    shownCount: lendingRequests.length,
    fetchedCount: totalFetched,
  });

  return (
    <div className={className}>
      <div className={styles.headerRow}>
        <h3 className={styles.header}>Din innboks</h3>
        <PillSwitch
          options={orderingOptions}
          value={ordering}
          onChange={onOrderingChange}
          ariaLabel="Sorter utlånsforespørsler"
        />
      </div>

      <LoadingIndicator loading={isFetching}>
        {hasRequests ? (
          <div className={styles.lendingRequestsContainer}>
            {lendingRequests.map((req) => (
              <LendingRequestCard key={req.id} lendingRequest={req} />
            ))}
          </div>
        ) : (
          <EmptyState
            className={styles.lendingRequestEmpty}
            iconNode={<Leaf />}
            body={<span>Du har ingen utlånsforespørsler</span>}
          />
        )}

        {canLoadMore && (
          <div className={styles.loadMoreRequest}>
            <Button
              onPress={onLoadMore}
              isPending={!isEmpty(lendingRequests) && isFetching}
              className={styles.loadMoreButton}
            >
              Se mer
            </Button>
          </div>
        )}
      </LoadingIndicator>
    </div>
  );
};

export default RequestInbox;
