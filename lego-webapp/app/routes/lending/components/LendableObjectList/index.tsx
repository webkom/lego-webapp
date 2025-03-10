import {
  Card,
  LoadingIndicator,
  Image,
  Page,
  filterSidebar,
  FilterSection,
  LinkButton,
  Flex,
  Button,
  Icon,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import { FolderOpen, MoveRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import EmptyState from '~/components/EmptyState';
import TextInput from '~/components/Form/TextInput';
import { Tag } from '~/components/Tags';
import Time from '~/components/Time';
import abakus_icon from '~/public/icon-192x192.png';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import { fetchLendingRequests } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { TransformedLendingRequest } from '~/redux/models/LendingRequest';
import { EntityType } from '~/redux/models/entities';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';
import styles from './LendableObjectList.module.css';
import type { ListLendableObject } from '~/redux/models/LendableObject';

const LendableObject = ({
  lendableObject,
}: {
  lendableObject: ListLendableObject;
}) => {
  return (
    <Link to={`/lending/${lendableObject.id}`}>
      <Card isHoverable hideOverflow className={styles.lendableObjectCard}>
        <Image
          className={styles.lendableObjectImage}
          src={lendableObject.image || abakus_icon}
          alt={`${lendableObject.title}`}
        />
        <div className={styles.lendableObjectFooter}>
          <h4>{lendableObject.title}</h4>
        </div>
      </Card>
    </Link>
  );
};

const LendingRequest = ({
  lendingRequest,
}: {
  lendingRequest: TransformedLendingRequest;
}) => {
  return (
    <Link
      to={`/lending/${lendingRequest.lendableObject.id}/${lendingRequest.id}`}
    >
      <Card isHoverable hideOverflow className={styles.lendingRequestCard}>
        <Image
          className={styles.lendingRequestImage}
          height={80}
          width={80}
          src={lendingRequest.lendableObject.image || abakus_icon}
          alt={`${lendingRequest.lendableObject.title}`}
        />
        <Flex column gap="var(--spacing-sm)">
          <h4>{lendingRequest.lendableObject.title}</h4>
          <Flex alignItems="center" gap={8}>
            <Time time={lendingRequest.startDate} format="DD. MMM" />
            <Icon iconNode={<MoveRight />} size={19} />
            <Time time={lendingRequest.endDate} format="DD. MMM" />
          </Flex>
        </Flex>
        <Tag tag={lendingRequest.status} />
      </Card>
    </Link>
  );
};

const LendableObjectList = () => {
  const { query, setQueryValue } = useQuery({
    search: '',
  });

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

  const actionGrant = useAppSelector(
    (state) => state.lendableObjects.actionGrant,
  );

  const fetchingObjects = useAppSelector(
    (state) => state.lendableObjects.fetching,
  );

  const filteredLendableObjects = lendableObjects.filter((lendableObjects) =>
    lendableObjects.title.toLowerCase().includes(query.search.toLowerCase()),
  );

  const title = 'Utlån';
  return (
    <Page
      title={title}
      actionButtons={
        <>
          {actionGrant.includes('create') && (
            <LinkButton href="/lending/new">Nytt utlånsobjekt</LinkButton>
          )}
        </>
      }
      sidebar={filterSidebar({
        children: (
          <FilterSection title="Søk">
            <TextInput
              prefix="search"
              placeholder="Grill, soundboks..."
              onChange={(e) => setQueryValue('search')(e.target.value)}
            />
          </FilterSection>
        ),
      })}
    >
      <Helmet title={title} />

      <h3>Dine utlånsforespørsler</h3>

      <LoadingIndicator loading={requestsPagination.fetching}>
        {lendingRequests.length ? (
          <div className={styles.lendingRequestsContainer}>
            {lendingRequests.map((lendingRequest) => (
              <LendingRequest
                key={lendingRequest.id}
                lendingRequest={lendingRequest}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            iconNode={<FolderOpen />}
            body={<span>Ingen utlånsforespørsler</span>}
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

      <h3>Tilgjengelige utlånsobjekter</h3>

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
