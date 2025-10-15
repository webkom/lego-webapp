import {
  LoadingIndicator,
  Image,
  Page,
  filterSidebar,
  FilterSection,
  LinkButton,
  Button,
  Icon,
  BaseCard,
  CardFooter,
  Flex,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import { Contact, FolderOpen, ImageOff, Package, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import { CheckBox } from '~/components/Form';
import TextInput from '~/components/Form/TextInput';
import { readmeIfy } from '~/components/ReadmeLogo';
import LendingRequestCard from '~/pages/lending/LendingRequestCard';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import { fetchLendingRequests } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectGroupsByIds } from '~/redux/slices/groups';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { LENDABLE_CATEGORY, FilterLendingCategory } from '~/utils/constants';
import truncateString from '~/utils/truncateString';
import useQuery from '~/utils/useQuery';
import styles from './LendableObjectList.module.css';
import type { ListLendableObject } from '~/redux/models/LendableObject';

const LendableObject = ({
  lendableObject,
}: {
  lendableObject: ListLendableObject;
}) => {
  const responsibleGroups = useAppSelector((state) =>
    selectGroupsByIds(state, lendableObject.responsibleGroups),
  );

  const formattedGroups = formatGroups(responsibleGroups) || '';

  return (
    <a href={`/lending/${lendableObject.id}`}>
      <BaseCard hoverable className={styles.lendableObjectCard}>
        <div className={styles.lendableObjectImageContainer}>
          {lendableObject.image ? (
            <Image
              className={styles.lendableObjectImage}
              src={lendableObject.image}
              alt={`${lendableObject.title}`}
            />
          ) : (
            <Icon
              className={styles.defaultObjectImage}
              iconNode={<ImageOff />}
              size={100}
            />
          )}
        </div>
        <CardFooter className={styles.lendableObjectInfobox}>
          <Flex>
            {/* Flex is needed for css title truncation */}
            <h3 title={lendableObject.title}>{lendableObject.title}</h3>
          </Flex>
          <p title={formattedGroups}>
            <Icon iconNode={<Contact />} size={18} />
            {readmeIfy(truncateString(formattedGroups, 15))}
          </p>
          <p>
            {<Icon iconNode={<Package />} size={18} />}
            {lendableObject.location}
          </p>
          <p>
            {<Icon iconNode={<Tag />} size={18} />}
            {LENDABLE_CATEGORY[lendableObject.category]}
          </p>
        </CardFooter>
      </BaseCard>
    </a>
  );
};

const formatGroups = (groups: { name: string }[]) => {
  return groups.length > 0 ? groups.map((g) => g.name).join(', ') : 'Ukjent';
};

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

  const showCategoryOutdoor = query.lendingCategories.includes('outdoors');
  const showCategoryPhotography =
    query.lendingCategories.includes('photography');
  const showCategorySpeaker = query.lendingCategories.includes('speaker');
  const showCategoryFurniture = query.lendingCategories.includes('furniture');
  const showCategoryOther = query.lendingCategories.includes('other');

  const title = 'Utlån';
  return (
    <Page
      title={title}
      actionButtons={
        <>
          {requestsActionGrant.includes('admin') && (
            <LinkButton href="/lending/admin">Administrator</LinkButton>
          )}
          {objectsActionGrant.includes('create') && (
            <LinkButton href="/lending/new">Nytt utstyr</LinkButton>
          )}
        </>
      }
      sidebar={filterSidebar({
        children: (
          <>
            <FilterSection title="Søk">
              <TextInput
                prefix="search"
                placeholder="Grill, soundboks..."
                value={query.search}
                onChange={(e) => setQueryValue('search')(e.target.value)}
              />
            </FilterSection>
            <FilterSection title="Kategori">
              <CheckBox
                id="outdoors"
                label="Utendørs"
                checked={showCategoryOutdoor}
                onChange={toggleLendingCategory('outdoors')}
              />
              <CheckBox
                id="photography"
                label="Fotografi"
                checked={showCategoryPhotography}
                onChange={toggleLendingCategory('photography')}
              />
              <CheckBox
                id="speaker"
                label="Høytaler"
                checked={showCategorySpeaker}
                onChange={toggleLendingCategory('speaker')}
              />
              <CheckBox
                id="furniture"
                label="Møbler"
                checked={showCategoryFurniture}
                onChange={toggleLendingCategory('furniture')}
              />
              <CheckBox
                id="other"
                label="Annet"
                checked={showCategoryOther}
                onChange={toggleLendingCategory('other')}
              />
            </FilterSection>
          </>
        ),
      })}
    >
      <Helmet title={title} />
      <LoadingIndicator loading={requestsPagination.fetching}>
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
            iconNode={<FolderOpen />}
            body={<span>Du har ingen utlånsforespørsler</span>}
          />
        )}
        {requestsPagination.hasMore && (
          <Button
            onPress={fetchMoreLendingRequests}
            isPending={!isEmpty(lendingRequests) && requestsPagination.fetching}
          >
            Last inn mer
          </Button>
        )}
      </LoadingIndicator>
      <div className={styles.divider} />
      <div className={styles.lendingSubsection}>
        <h3>Tilgjengelig utstyr</h3>
      </div>
      <LoadingIndicator loading={fetchingObjects}>
        {filteredLendableObjects.length ? (
          <div className={styles.lendableObjectsContainer}>
            {filteredLendableObjects.map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            iconNode={<FolderOpen />}
            body={
              query.search ? (
                <span>
                  Fant ingen treff på søket <em>{query.search}</em>
                </span>
              ) : (
                <span>Ingen tilgjengelige utlånsobjekter</span>
              )
            }
          />
        )}
      </LoadingIndicator>
    </Page>
  );
};

export default LendableObjectList;
