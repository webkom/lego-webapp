import { PageContainer, LinkButton, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { gsap } from 'gsap';
import { HeartHandshake } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
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
import FilterSearch from './FilterSearch';
import ItemIndex from './ItemIndex';
import styles from './LendingPage.module.css';
import RequestInbox, {
  type LendingRequestArchivedFilter,
} from './RequestInbox';
import {
  REQUEST_INBOX_PAGE_SIZE,
  getNextVisibleCount,
  getVisibleRequestCount,
  shouldFetchMoreRequests,
} from './requestInboxPagination';
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
  const activeRequestQuery = {
    archived: 'false' as const,
  };
  const archivedRequestQuery = {
    archived: 'true' as const,
  };

  const dispatch = useAppDispatch();

  const heartRef = useRef(null);

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

  const handleArchiveRequest = async (
    requestId: TransformedLendingRequest['id'],
    archived: boolean,
  ) => {
    await dispatch(editLendingRequest({ id: requestId, archived }));
    await Promise.all([
      dispatch(fetchLendingRequests({ query: activeRequestQuery })),
      dispatch(fetchLendingRequests({ query: archivedRequestQuery })),
    ]);
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

  useEffect(() => {
    if (!heartRef.current) return;

    const ctx = gsap.context(() => {
      const shapes = gsap.utils.toArray<SVGGeometryElement>(
        'svg path, svg line, svg polyline, svg polygon, svg circle, svg rect',
      );

      shapes.forEach((shape) => {
        const length = shape.getTotalLength();

        gsap.set(shape, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      const tl = gsap.timeline();

      tl.to(
        shapes,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.out',
          stagger: 0.06,
        },
        0,
      ).fromTo(
        shapes,
        { stroke: 'var(--lego-font-color)' },
        {
          stroke: 'oklch(63.7% 0.237 25.331)',
          duration: 2.3,
          ease: 'power2.out',
        },
        0,
      );
    }, heartRef);

    return () => ctx.revert();
  }, []);

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
          <div className={styles.infoText} ref={heartRef}>
            <Icon
              className={styles.heartIcon}
              iconNode={<HeartHandshake />}
              strokeWidth={0.8}
            />
            <h4>Hvordan bruke utlånssystemet?</h4>
            <p>
              Dette er et digitalt lånessystem for å gjøre utlån enkelt og
              oversiktlig. Alle brukere er velkommen til å bruke løsningen.
              Registrer alltid lån/retur, ta godt vare på utstyret, og lever
              tilbake til avtalt tid. Oppdager du feil eller skade, gi beskjed
              så fort som mulig. Hvert utlånsobjekt tilhører en komité. Reglene
              for utlån kan derfor variere, og du må følge retningslinjene som
              gjelder for den aktuelle komiteen.
            </p>
          </div>
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
