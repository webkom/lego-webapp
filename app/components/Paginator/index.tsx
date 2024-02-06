import { LoadingIndicator } from '@webkom/lego-bricks';
import InfiniteScroll from 'react-infinite-scroller';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  hasMore: boolean;
  fetchNext: () => void;
  fetching: boolean;
};
const Paginator = ({ children, hasMore, fetchNext, fetching }: Props) => {
  const loadMore = () => {
    if (fetchNext && !fetching) {
      fetchNext();
    }
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      loadMore={loadMore}
      threshold={50}
      loader={<LoadingIndicator loading={fetching} />}
    >
      {children}
    </InfiniteScroll>
  );
};

export default Paginator;
