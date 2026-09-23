import { PageContainer, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import FilterSearch from '~/pages/lending/_components/FilterSearch';
import HowToSection from '~/pages/lending/_components/HowToSection';
import ItemIndex from '~/pages/lending/_components/ItemIndex';
import RequestInbox from '~/pages/lending/_components/RequestInbox';
import {
  REQUEST_INBOX_PAGE_SIZE,
  getNextVisibleCount,
  getVisibleRequestCount,
  shouldFetchMoreRequests,
} from '~/pages/lending/_components/requestInboxPagination';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import {
  editLendingRequest,
  fetchLendingRequests,
} from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectLendableObjectsForIndex } from '~/redux/slices/lendableObjects';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { FilterLendingCategory } from '~/utils/constants';
import useQuery from '~/utils/useQuery';
import styles from './LendingPage.module.css';
import type { LendingRequestArchivedFilter } from '~/pages/lending/_components/RequestInbox';
import type { TransformedLendingRequest } from '~/redux/models/LendingRequest';

const defaultLendingQuery = {
  search: '',
  lendingCategories: [] as FilterLendingCategory[],
  archived: 'false' as LendingRequestArchivedFilter,
};

const LendableObjectList = () => {
  const { query, setQueryValue } = useQuery(defaultLendingQuery);
  const requestArchived: LendingRequestArchivedFilter =
    query.archived === 'true' ? 'true' : 'false';
  const requestQuery = {
    archived: requestArchived,
  };

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendableObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  usePreparedEffect(
    'fetchAllLendingRequests',
    () =>
      dispatch(
        fetchLendingRequests({
          query: requestQuery,
        }),
      ),
    [requestArchived],
  );

  const { pagination: requestsPagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/lending/requests/',
      entity: EntityType.LendingRequests,
      query: requestQuery,
    })(state),
  );

  const fetchMoreLendingRequests = () => {
    return dispatch(
      fetchLendingRequests({
        query: requestQuery,
        next: true,
      }),
    );
  };
  const lendableObjects = useAppSelector(selectLendableObjectsForIndex);

  const originalLendingRequests = useAppSelector((state) =>
    selectTransformedLendingRequests(state, { pagination: requestsPagination }),
  );
  const [visibleCount, setVisibleCount] = useState(REQUEST_INBOX_PAGE_SIZE);
  const previousRequestArchivedRef = useRef(requestArchived);
  const visibleRequestCount = getVisibleRequestCount({
    visibleCount,
    currentArchived: requestArchived,
    previousArchived: previousRequestArchivedRef.current,
  });

  const visibleRequests = originalLendingRequests.filter(
    (request) => request.archived === (requestArchived === 'true'),
  );
  const lendingRequests = visibleRequests.slice(0, visibleRequestCount);

  const handleLoadMore = () => {
    const nextVisibleCount = getNextVisibleCount(visibleRequestCount);

    if (
      shouldFetchMoreRequests({
        nextVisibleCount,
        fetchedCount: visibleRequests.length,
        hasMore: requestsPagination.hasMore,
        isFetching: requestsPagination.fetching,
      })
    ) {
      fetchMoreLendingRequests();
    }
    setVisibleCount(nextVisibleCount);
  };

  const handleArchiveRequest = async (
    requestId: TransformedLendingRequest['id'],
    archived: boolean,
  ) => {
    try {
      await dispatch(editLendingRequest({ id: requestId, archived }));
    } catch {
      // editLendingRequest carries an errorMessage meta, so the failure has
      // already been toasted - the card just stays where it is
    }
  };

  const objectsActionGrant = useAppSelector(
    (state) => state.lendableObjects.actionGrant,
  );

  const requestsActionGrant = useAppSelector(
    (state) => state.lendingRequests.actionGrant,
  );

  const fetchingObjects = useAppSelector(
    (state) => state.lendableObjects.fetching,
  );

  const filteredLendableObjects = lendableObjects.filter((obj) => {
    const matchesSearch = obj.title
      .toLowerCase()
      .includes(query.search.toLowerCase());
    const matchesCategory =
      query.lendingCategories.length === 0 ||
      query.lendingCategories.includes(obj.category as FilterLendingCategory);
    return matchesSearch && matchesCategory;
  });

  const toggleLendingCategory = (category: FilterLendingCategory) => () => {
    setQueryValue('lendingCategories')(
      query.lendingCategories.includes(category)
        ? query.lendingCategories.filter((t) => t !== category)
        : [...query.lendingCategories, category],
    );
  };

  useEffect(() => {
    previousRequestArchivedRef.current = requestArchived;
    setVisibleCount(REQUEST_INBOX_PAGE_SIZE);
  }, [requestArchived]);

  const title = 'Utlån';
  return (
    <PageContainer card={false}>
      <Helmet title={title} />
      <div className={styles.topHeader}>
        <div className={styles.topSection}>
          <h1>{title}</h1>
          <div className={styles.actionButtons}>
            {requestsActionGrant.includes('admin') && (
              <LinkButton href="/lending/admin">Administrator</LinkButton>
            )}
          </div>
        </div>
        <div className={styles.divider}></div>
      </div>
      <section className={styles.wrapper}>
        <div className={styles.topText}>
          <HowToSection />
        </div>
        <FilterSearch
          search={query.search}
          onSearchChange={setQueryValue('search')}
          selected={query.lendingCategories}
          onToggle={toggleLendingCategory}
          className={styles.filterSearch}
        />
        <RequestInbox
          lendingRequests={lendingRequests}
          totalFetched={visibleRequests.length}
          isFetching={requestsPagination.fetching}
          hasMore={requestsPagination.hasMore}
          onLoadMore={handleLoadMore}
          onArchive={handleArchiveRequest}
          archived={requestArchived}
          onArchivedChange={setQueryValue('archived')}
          className={styles.requestInbox}
        />
        <ItemIndex
          lendableObjects={filteredLendableObjects}
          isFetching={fetchingObjects}
          searchQuery={query.search}
          canCreate={objectsActionGrant.includes('create')}
          className={styles.itemIndex}
        />
      </section>
    </PageContainer>
  );
};

export default LendableObjectList;
