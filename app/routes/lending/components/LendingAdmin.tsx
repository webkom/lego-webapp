import { Button, Card, Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
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
    () => {
      dispatch(fetchAllLendingRequests());
      dispatch(fetchAllLendableObjects());
    },
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

  const title = 'Utlånsforepørsler';
  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: '/lending',
        }}
      />
      <div className={styles.lendingRequestsContainer}>
        <h2 className={styles.heading}>Ventende utlånsforespørsler</h2>
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
            <h2 className={styles.heading}>Tidligere utlånsforespørsler</h2>
            <Flex column>
              {lendingRequests
                .filter(
                  (request) => request.status !== LendingRequestStatus.PENDING,
                )
                .map((request) => (
                  <RequestItem key={request.id} request={request} isAdmin />
                ))}
            </Flex>
            <Button onClick={() => setShowOldRequests(false)}>
              Skjul tidligere forespørsler
            </Button>
          </>
        ) : (
          <Button onClick={() => setShowOldRequests(true)}>
            Vis tidligere forespørsler
          </Button>
        )}
      </div>

      <NavigationTab
        title="Utlånsobjekter"
        className={styles.heading}
        details={
          <Link to="/lending/create">
            <Button>Nytt utlånsobject</Button>
          </Link>
        }
      />

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
    </Content>
  );
};

export default LendableObjectsAdmin;
