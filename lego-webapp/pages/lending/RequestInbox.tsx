import { LoadingIndicator, Button, Icon } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash-es';
import { Leaf, Inbox } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import LendingRequestCard from './LendingRequestCard';
import styles from './RequestInbox.module.css';
import type { TransformedLendingRequest } from '../../redux/models/LendingRequest';

type Props = {
  lendingRequests: TransformedLendingRequest[];
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
};

const RequestInbox = ({
  lendingRequests,
  isFetching,
  hasMore,
  onLoadMore,
  className,
}: Props) => {
  return (
    <div className={className}>
      <div className={styles.lendingRequestMailBox}>
        <div className={styles.lendingRequestMailBoxTitle}>
          <Icon iconNode={<Inbox />} />
          <h3>Innboks</h3>
        </div>
        <LoadingIndicator loading={isFetching}>
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
    </div>
  );
};

export default RequestInbox;
