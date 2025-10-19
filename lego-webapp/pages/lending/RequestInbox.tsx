import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Leaf } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import LendingRequestCard from './LendingRequestCard';
import styles from './RequestInbox.module.css';
import type { TransformedLendingRequest } from '../../redux/models/LendingRequest';

type Props = {
  lendingRequests: TransformedLendingRequest[];
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

const RequestInbox = ({
  lendingRequests,
  isFetching,
  hasMore,
  onLoadMore,
}: Props) => {
  return (
    <LoadingIndicator loading={isFetching}>
      <div className={styles.lendingRequestWrapper}>
        {lendingRequests.length ? (
          <div className={styles.lendingRequestsContainer}>
            {lendingRequests.map((lendingRequest) => (
              <LendingRequestCard
                key={lendingRequest.id}
                lendingRequest={lendingRequest}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className={styles.lendingRequestEmpty}
            iconNode={<Leaf />}
            body={<span>Du har ingen utlånsforespørsler</span>}
          />
        )}
        {hasMore && (
          <div className={styles.loadMoreButton}>
            <Button
              onPress={onLoadMore}
              isPending={!isEmpty(lendingRequests) && isFetching}
              style={{
                backgroundColor: 'var(--color-gray-2)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Hent flere
            </Button>
          </div>
        )}
      </div>
    </LoadingIndicator>
  );
};

export default RequestInbox;
