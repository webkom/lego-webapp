import {
  LoadingIndicator,
  Page,
  filterSidebar,
  FilterSection,
  LinkButton,
  Button,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import { FolderOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import { CheckBox } from '~/components/Form';
import LendingRequestCard from '~/pages/lending/LendingRequestCard';
import { statusMap } from '~/pages/lending/LendingStatusTag';
import { fetchLendingRequestsAdmin } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { LendingRequestStatus } from '~/redux/models/LendingRequest';
import { EntityType } from '~/redux/models/entities';
import { selectTransformedLendingRequests } from '~/redux/slices/lendingRequests';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';
import styles from '../LendingPage.module.css';

const LendingAdmin = () => {
  const { query, setQueryValue } = useQuery({
    status: 'created,unapproved,changes_requested,changes_resolved',
  });

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdminLendingRequests',
    () =>
      dispatch(
        fetchLendingRequestsAdmin({
          query,
        }),
      ),
    [query.status],
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
        query,
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

  const statuses = (query.status?.split(',') || []).filter((s) => !isEmpty(s));

  const handleStatusToggle = (status: string) => {
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];

    setQueryValue('status')(newStatuses.join(','));
  };

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
          <>
            <FilterSection title="Status">
              {Object.values(LendingRequestStatus).map((status) => (
                <CheckBox
                  key={status}
                  id={status}
                  label={statusMap[status].name}
                  checked={statuses.includes(status)}
                  onChange={() => {
                    handleStatusToggle(status);
                  }}
                />
              ))}
            </FilterSection>
          </>
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
