import {
  LoadingIndicator,
  Page,
  filterSidebar,
  FilterSection,
  LinkButton,
  Button,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import { FolderOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import TextInput from '~/components/Form/TextInput';
import HTTPError from '~/components/errors/HTTPError';
import LendingRequestCard from '~/pages/lending/LendingRequestCard';
import { fetchLendingRequestsAdmin } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { useFeatureFlag } from '~/utils/useFeatureFlag';
import useQuery from '~/utils/useQuery';
import styles from '../LendableObjectList.module.css';

const LendingAdmin = () => {
  const { query, setQueryValue } = useQuery({
    search: '',
  });

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdminLendingRequests',
    () => dispatch(fetchLendingRequestsAdmin({})),
    [],
  );

  const { pagination: requestsPagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/lending/requests/admin/',
      entity: EntityType.LendingRequests,
      query,
    })(state),
  );

  const fetchMoreLendingRequests = () => {
    return dispatch(
      fetchLendingRequestsAdmin({
        next: true,
      }),
    );
  };

  const lendingRequests = useAppSelector((state) =>
    selectTransformedLendingRequests(state, { pagination: requestsPagination }),
  );

  const actionGrant = useAppSelector(
    (state) => state.lendableObjects.actionGrant,
  );

  if (!useFeatureFlag('lending')) {
    return <HTTPError />;
  }

  const title = 'Utlån - Admin';
  return (
    <Page
      title={title}
      back={{ href: '/lending' }}
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
              value={query.search}
              onChange={(e) => setQueryValue('search')(e.target.value)}
            />
          </FilterSection>
        ),
      })}
    >
      <Helmet title={title} />
      <h3>Utlånsforespørsler</h3>
      <LoadingIndicator loading={requestsPagination.fetching}>
        {lendingRequests.length ? (
          <div className={styles.lendingRequestsContainer}>
            {lendingRequests.map((lendingRequest) => (
              <LendingRequestCard
                key={lendingRequest.id}
                lendingRequest={lendingRequest}
                isFromAdmin
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
    </Page>
  );
};

export default LendingAdmin;
