import { LoadingIndicator, Button, Icon } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Leaf, Inbox } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import LendingRequestCard from './LendingRequestCard';
import styles from './RequestInbox.module.css';
import type { TransformedLendingRequest } from '../../redux/models/LendingRequest';

type Props = {
  lendingRequests: TransformedLendingRequest[];
  totalFetched: number;
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
};

const RequestInbox = ({
  lendingRequests,
  totalFetched,
  isFetching,
  hasMore,
  onLoadMore,
  className,
}: Props) => {
  const hasRequests = lendingRequests.length > 0;
  const canLoadMore =
    !isFetching &&
    hasMore &&
    hasRequests &&
    lendingRequests.length < totalFetched;

  return (
    <div className={className}>
      <header className={styles.lendingRequestMailBoxTitle}>
        <Icon iconNode={<Inbox />} />
        <h3>Innboks</h3>
      </header>

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
