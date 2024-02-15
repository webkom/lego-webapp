import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './LendingAdmin.css';
import { RequestItem, LendingRequestStatus } from './RequestItem';
import type { ListLendableObject } from 'app/store/models/LendableObject';

const LendableObjectsAdmin = () => {
  const lendingRequests = [
    {
      id: 1,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      status: LendingRequestStatus.PENDING,
      lendableObject: {
        id: 1,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
    {
      id: 2,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      approved: false,
      status: LendingRequestStatus.PENDING,
      lendableObject: {
        id: 2,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
    {
      id: 3,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      approved: false,
      status: LendingRequestStatus.APPROVED,
      lendableObject: {
        id: 2,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
    {
      id: 4,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      approved: false,
      status: LendingRequestStatus.DENIED,
      lendableObject: {
        id: 2,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
  ];

  const lendableObjects: Array<ListLendableObject> = [
    {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
    {
      id: 2,
      title: 'Soundboks',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
    {
      id: 3,
      title: 'Soundboks2',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
    {
      id: 4,
      title: 'Prinsessekjole',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
    {
      id: 5,
      title: 'Falk',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  ];

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
        {lendingRequests
          .filter((request) => request.status === LendingRequestStatus.PENDING)
          .map((request) => (
            <RequestItem key={request.id} request={request} isAdmin />
          ))}
      </Flex>
      
      {showOldRequests ? (
        <>
          <h2 className={styles.heading}>Tidligere utlånsforespørsler</h2>
          <Flex column gap={10} margin="0 0 30px">
            {lendingRequests
              .filter((request) => request.status !== LendingRequestStatus.PENDING)
              .map((request) => (
                <RequestItem key={request.id} request={request} isAdmin />
              ))}
          </Flex>
          <Button onClick={() => setShowOldRequests(false)}>Skjul tidligere forespørsler</Button>
        </>
      ) : <Button onClick={() => setShowOldRequests(true)}>Vis tidligere forespørsler</Button>}
      

      <h2 className={styles.heading}>Utlånsobjekter</h2>
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
    </Content>
  );
};

export default LendableObjectsAdmin;
