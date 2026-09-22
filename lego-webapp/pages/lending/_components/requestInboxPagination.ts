export const REQUEST_INBOX_PAGE_SIZE = 4;

export const getNextVisibleCount = (visibleCount: number) =>
  visibleCount + REQUEST_INBOX_PAGE_SIZE;

export const getVisibleRequestCount = ({
  visibleCount,
  currentArchived,
  previousArchived,
}: {
  visibleCount: number;
  currentArchived: string;
  previousArchived: string;
}) =>
  currentArchived === previousArchived ? visibleCount : REQUEST_INBOX_PAGE_SIZE;

export const canLoadMoreRequests = ({
  hasMore,
  shownCount,
  fetchedCount,
}: {
  hasMore: boolean;
  shownCount: number;
  fetchedCount: number;
}) => shownCount > 0 && (shownCount < fetchedCount || hasMore);

export const shouldFetchMoreRequests = ({
  nextVisibleCount,
  fetchedCount,
  hasMore,
  isFetching,
}: {
  nextVisibleCount: number;
  fetchedCount: number;
  hasMore: boolean;
  isFetching: boolean;
}) => nextVisibleCount > fetchedCount && hasMore && !isFetching;
