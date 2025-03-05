import { LoadingIndicator } from '@webkom/lego-bricks';
import InfiniteScroll from 'react-infinite-scroller';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  hasMore: boolean;
  fetchNext: () => void;
  fetching: boolean;
  className?: string;
  loaderClassName?: string;
};
const Paginator = ({
  children,
  hasMore,
  fetchNext,
  fetching,
  className,
  loaderClassName,
}: Props) => {
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
      loader={
        <LoadingIndicator
          key="loading-indicator"
          loading={fetching}
          className={loaderClassName}
        />
      }
      className={className}
    >
      {children}
    </InfiniteScroll>
  );
};

export default Paginator;
