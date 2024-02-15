import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { LendingRequestStatus } from 'app/store/models/LendingRequest';
import styles from './LendingAdmin.css';
import { RequestItem } from './RequestItem';
import { exampleListLendableObjects, exampleRequests } from './fixtures';

const LendableObjectsAdmin = () => {
  const [showOldRequests, setShowOldRequests] = useState(false);

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
      <Flex column gap={10} margin="0 0 30px">
        {exampleRequests
          .filter((request) => request.status === LendingRequestStatus.PENDING)
          .map((request) => (
            <RequestItem key={request.id} request={request} isAdmin />
          ))}
      </Flex>

      {showOldRequests ? (
        <>
          <h2 className={styles.heading}>Tidligere utlånsforespørsler</h2>
          <Flex column gap={10} margin="0 0 30px">
            {exampleRequests
              .filter(
                (request) => request.status !== LendingRequestStatus.PENDING
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
      <Flex column gap={10}>
        <Link to={`/lending/create`}>
          <Card shadow isHoverable className={styles.newLendableObject}>
            <Icon name="add-outline" size={30} />
          </Card>
        </Link>
        <div className={styles.lendableObjectsContainer}>
          {exampleListLendableObjects.map((lendableObject) => (
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
    </Content>
  );
};

export default LendableObjectsAdmin;
