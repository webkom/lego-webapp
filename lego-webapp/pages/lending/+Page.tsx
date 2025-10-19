import { PageContainer, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import { fetchLendingRequests } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { FilterLendingCategory } from '~/utils/constants';
import useQuery from '~/utils/useQuery';
import FilterSearch from './FilterSearch';
import ItemIndex from './ItemIndex';
import styles from './LendingPage.module.css';
import RequestInbox from './RequestInbox';

const defaultLendingQuery = {
  search: '',
  lendingCategories: [] as FilterLendingCategory[],
};

const LendableObjectList = () => {
  const { query, setQueryValue } = useQuery(defaultLendingQuery);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendableObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  usePreparedEffect(
    'fetchAllLendingRequests',
    () => dispatch(fetchLendingRequests({})),
    [],
  );

  const { pagination: requestsPagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/lending/requests/',
      entity: EntityType.LendingRequests,
      query,
    })(state),
  );

  const fetchMoreLendingRequests = () => {
    return dispatch(
      fetchLendingRequests({
        next: true,
      }),
    );
  };

  const lendableObjects = useAppSelector(selectAllLendableObjects);

  const lendingRequests = useAppSelector((state) =>
    selectTransformedLendingRequests(state, { pagination: requestsPagination }),
  );
  console.log('Requests:', lendingRequests);

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

  const title = 'Utlån';
  return (
    <PageContainer card={false}>
      <Helmet title={title} />
      <div className={styles.topSection}>
        <h1>{title}</h1>
        <div className={styles.actionButtons}>
          {requestsActionGrant.includes('admin') && (
            <LinkButton href="/lending/admin">Administrator</LinkButton>
          )}
        </div>
      </div>
      <section className={styles.wrapper}>
        <div className={styles.filterSearch}>
          <FilterSearch
            search={query.search}
            onSearchChange={setQueryValue('search')}
            selected={query.lendingCategories}
            onToggle={toggleLendingCategory}
          />
        </div>
        <div className={styles.requestInbox}>
          <RequestInbox
            lendingRequests={lendingRequests}
            isFetching={requestsPagination.fetching}
            hasMore={requestsPagination.hasMore}
            onLoadMore={fetchMoreLendingRequests}
          />
        </div>
        <div className={styles.lendingIndex}>
          <ItemIndex
            lendableObjects={filteredLendableObjects}
            isFetching={fetchingObjects}
            searchQuery={query.search}
            canCreate={objectsActionGrant.includes('create')}
          />
        </div>
      </section>
    </PageContainer>
  );
};

export default LendableObjectList;
