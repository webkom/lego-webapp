import { Button, LoadingIndicator } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Leaf } from 'lucide-react';
import { useRef } from 'react';
import PillSwitch, { type PillSwitchOption } from '~/components/PillSwitch';
import EmptyState from '../../components/EmptyState';
import LendingRequestCard from './LendingRequestCard';
import styles from './RequestInbox.module.css';
import { canLoadMoreRequests } from './requestInboxPagination';
import useAnimateRequestInbox from './useAnimateRequestInbox';
import type { TransformedLendingRequest } from '~/redux/models/LendingRequest';

export type LendingRequestArchivedFilter = 'true' | 'false';

const archivedOptions: PillSwitchOption<LendingRequestArchivedFilter>[] = [
  { label: 'Aktiv', value: 'false' },
  { label: 'Arkivert', value: 'true' },
];

type Props = {
  lendingRequests: TransformedLendingRequest[];
  totalFetched: number;
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onArchive: (
    requestId: TransformedLendingRequest['id'],
    archived: boolean,
  ) => void;
  archived: LendingRequestArchivedFilter;
  onArchivedChange: (archived: LendingRequestArchivedFilter) => void;
  className?: string;
};

const RequestInbox = ({
  lendingRequests,
  totalFetched,
  isFetching,
  hasMore,
  onLoadMore,
  onArchive,
  archived,
  onArchivedChange,
  className,
}: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestIds = lendingRequests.map((request) => String(request.id));
  const hasRequests = lendingRequests.length > 0;
  const showInitialLoading = !hasRequests && isFetching;
  const showEmptyState = !hasRequests && !isFetching;
  const canLoadMore = canLoadMoreRequests({
    hasMore,
    shownCount: lendingRequests.length,
    fetchedCount: totalFetched,
  });
  useAnimateRequestInbox(
    listRef,
    requestIds,
    canLoadMore ? loadMoreRef : undefined,
  );

  return (
    <div className={className}>
      <div className={styles.headerRow}>
        <h3 className={styles.header}>Din innboks</h3>
        <PillSwitch
          options={archivedOptions}
          value={archived}
          onChange={(value) =>
            onArchivedChange(value === 'true' ? 'true' : 'false')
          }
          ariaLabel="Sorter utlånsforespørsler"
        />
      </div>
      {showInitialLoading && (
        <div className={styles.loadingState}>
          <LoadingIndicator loading />
        </div>
      )}
      {hasRequests && (
        <div ref={listRef} className={styles.lendingRequestsContainer}>
          {lendingRequests
            .filter((req) => req.archived === (archived === 'true'))
            .map((req) => (
            <div
              key={req.id}
              data-request-id={String(req.id)}
              className={styles.requestCardWrapper}
            >
              <LendingRequestCard lendingRequest={req} onArchive={onArchive} />
            </div>
          ))}
        </div>
      )}
      {showEmptyState && (
        <EmptyState
          className={styles.lendingRequestEmpty}
          iconNode={<Leaf />}
          body={<span>Du har ingen utlånsforespørsler</span>}
        />
      )}
      {canLoadMore && (
        <div ref={loadMoreRef} className={styles.loadMoreRequest}>
          <Button
            onPress={onLoadMore}
            isPending={!isEmpty(lendingRequests) && isFetching}
            className={styles.loadMoreButton}
          >
            Se mer
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestInbox;
