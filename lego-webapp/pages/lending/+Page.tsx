import { PageContainer, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import FilterSearch from '~/pages/lending/_components/FilterSearch';
import HowToSection from '~/pages/lending/_components/HowToSection';
import ItemIndex from '~/pages/lending/_components/ItemIndex';
import RequestInbox, {
  type LendingRequestOrdering,
} from '~/pages/lending/_components/RequestInbox';
import {
  REQUEST_INBOX_PAGE_SIZE,
  getNextVisibleCount,
  getVisibleRequestCount,
  shouldFetchMoreRequests,
} from '~/pages/lending/_components/requestInboxPagination';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import { fetchLendingRequests } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectLendableObjectsForIndex } from '~/redux/slices/lendableObjects';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { FilterLendingCategory } from '~/utils/constants';
import useQuery from '~/utils/useQuery';
import styles from './LendingPage.module.css';

const defaultLendingQuery = {
  search: '',
  lendingCategories: [] as FilterLendingCategory[],
  ordering: '-created_at' as LendingRequestOrdering,
};

const LendableObjectList = () => {
  const { query, setQueryValue } = useQuery(defaultLendingQuery);
  const requestOrdering: LendingRequestOrdering =
    query.ordering === 'created_at' ? 'created_at' : '-created_at';
  const requestQuery = {
    ordering: requestOrdering,
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
    [requestOrdering],
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
  const previousRequestOrderingRef = useRef(requestOrdering);
  const visibleRequestCount = getVisibleRequestCount({
    visibleCount,
    currentOrdering: requestOrdering,
    previousOrdering: previousRequestOrderingRef.current,
  });

  const lendingRequests = originalLendingRequests.slice(0, visibleRequestCount);

  const handleLoadMore = () => {
    const nextVisibleCount = getNextVisibleCount(visibleRequestCount);

    if (
      shouldFetchMoreRequests({
        nextVisibleCount,
        fetchedCount: originalLendingRequests.length,
        hasMore: requestsPagination.hasMore,
        isFetching: requestsPagination.fetching,
      })
    ) {
      fetchMoreLendingRequests();
    }
    setVisibleCount(nextVisibleCount);
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
    previousRequestOrderingRef.current = requestOrdering;
    setVisibleCount(REQUEST_INBOX_PAGE_SIZE);
  }, [requestOrdering]);

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
          totalFetched={originalLendingRequests.length}
          isFetching={requestsPagination.fetching}
          hasMore={requestsPagination.hasMore}
          onLoadMore={handleLoadMore}
          ordering={requestOrdering}
          onOrderingChange={setQueryValue('ordering')}
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
