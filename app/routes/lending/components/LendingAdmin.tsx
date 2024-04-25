import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { selectLendableObjects } from 'app/reducers/lendableObjects';
import { selectLendingRequests } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { LendingRequestStatus } from 'app/store/models/LendingRequest';
import styles from './LendingAdmin.css';
import { RequestItem } from './RequestItem';

const LendableObjectsAdmin = () => {
  const [showOldRequests, setShowOldRequests] = useState(false);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  const lendableObjects = useAppSelector((state) =>
    selectLendableObjects(state),
  );
  const fetchingObjects = useAppSelector(
    (state) => state.lendableObjects.fetching,
  );

  usePreparedEffect(
    'fetchRequests',
    () => dispatch(fetchAllLendingRequests()),
    [],
  );

  const lendingRequests = useAppSelector((state) =>
    selectLendingRequests(state),
  );

  const fetchingRequests = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  return (
    <Content>
      <Helmet title="Utlån" />
      <NavigationTab
        title="Utlånsforespørsler"
        back={{
          label: 'Tilbake',
          path: '/lending',
        }}
      />
      <h2 className={styles.heading}>Ventende utlånsforespørsler</h2>
      <LoadingIndicator loading={fetchingRequests}>
        <Flex column gap={10} margin="0 0 30px">
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
          <Flex column gap={10} margin="0 0 30px">
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

      <h2 className={styles.heading}>Utlånsobjekter</h2>
      <LoadingIndicator loading={fetchingObjects}>
        <Flex column gap={10}>
          <Link to={`/lending/create`}>
            <Card shadow isHoverable className={styles.newLendableObject}>
              <Icon name="add-outline" size={30} />
            </Card>
          </Link>
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
                  <h3>
                    {lendableObject.id} - {lendableObject.title}
                  </h3>
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
