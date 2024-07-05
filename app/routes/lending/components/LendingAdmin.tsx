import {
  Button,
  Card,
  Flex,
  LinkButton,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import { selectAllLendableObjects } from 'app/reducers/lendableObjects';
import { selectAllLendingRequests } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { LendingRequestStatus } from 'app/store/models/LendingRequest';
import styles from './LendingAdmin.css';
import { RequestItem } from './RequestItem';

const LendableObjectsAdmin = () => {
  const [showOldRequests, setShowOldRequests] = useState(false);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendingObjectsAndRequests',
    () =>
      Promise.allSettled([
        dispatch(fetchAllLendingRequests()),
        dispatch(fetchAllLendableObjects()),
      ]),
    [],
  );

  const lendableObjects = useAppSelector(selectAllLendableObjects);
  const fetchingObjects = useAppSelector(
    (state) => state.lendableObjects.fetching,
  );

  const lendingRequests = useAppSelector((state) =>
    selectAllLendingRequests(state),
  );

  const fetchingRequests = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  const title = 'Admin: Utlånssystem';
  return (
    <Page
      title={title}
      back={{
        href: '/lending',
      }}
      actionButtons={
        <LinkButton href="/lending/create">Nytt utlånsobjekt</LinkButton>
      }
    >
      <Helmet title={title} />

      <h2>Utlånsforepørsler</h2>
      <div className={styles.lendingRequestsContainer}>
        <h3>Ventende utlånsforespørsler</h3>
        <LoadingIndicator loading={fetchingRequests}>
          <Flex column>
            {lendingRequests
              .filter(
                (request) => request.status === LendingRequestStatus.PENDING,
              )
              .map((request) => (
                <RequestItem key={request.id} request={request} isAdmin />
              ))}
          </Flex>
        </LoadingIndicator>

        {showOldRequests ? (
          <>
            <h3>Tidligere utlånsforespørsler</h3>
            <Flex column>
              {lendingRequests
                .filter(
                  (request) => request.status !== LendingRequestStatus.PENDING,
                )
                .map((request) => (
                  <RequestItem key={request.id} request={request} isAdmin />
                ))}
            </Flex>
            <Button onPress={() => setShowOldRequests(false)}>
              Skjul tidligere forespørsler
            </Button>
          </>
        ) : (
          <Button onPress={() => setShowOldRequests(true)}>
            Vis tidligere forespørsler
          </Button>
        )}
      </div>

      <h2>Utlånsobjekter</h2>

      <LoadingIndicator loading={fetchingObjects}>
        <Flex column gap="var(--spacing-sm)">
          <div className={styles.lendableObjectsContainer}>
            {lendableObjects.map((lendableObject) => (
              <Link
                to={`/lending/${lendableObject.id}/admin`}
                key={lendableObject.id}
              >
                <Card
                  isHoverable
                  hideOverflow
                  className={styles.lendableObjectCard}
                >
                  <h3>{lendableObject.title}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </Flex>
      </LoadingIndicator>
    </Page>
  );
};

export default LendableObjectsAdmin;
