import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './LendableObjectsAdmin.css';
import { useState } from 'react';
import { ListLendableObject } from 'app/store/models/LendableObject';
import { LendingRequest, status } from './components/LendingRequest';

const LendableObjectsAdmin = () => {
  const lendingRequests = [
    {
      id: 1,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      status: status.PENDING,
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
      status: status.PENDING,
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
      status: status.APPROVED,
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
      status: status.DENIED,
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

  const [showFetchMore, setShowFetchMore] = useState(true);

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
          .filter((request) => request.status === status.PENDING)
          .map((request) => (
            <LendingRequest key={request.id} request={request} isAdmin />
          ))}
      </Flex>

      <h2 className={styles.heading}>Tidligere utlånsforespørsler</h2>
      <Flex column gap={10} margin="0 0 30px">
        {lendingRequests
          .filter((request) => request.status !== status.PENDING)
          .map((request) => (
            <LendingRequest key={request.id} request={request} isAdmin />
          ))}
        {showFetchMore && <Button onClick={() => {}}>Last inn mer</Button>}
      </Flex>

      <h2 className={styles.heading}>Utlånsobjekter</h2>
      <Flex column gap={10}>
        <Link to={`/lending/new`}>
          <Card shadow isHoverable className={styles.newLendableObject}>
            <Icon name="add-outline" size={30} />
          </Card>
        </Link>
        {lendableObjects.map((lendableObject) => (
          <Card
            key={lendableObject.id}
            shadow
            className={styles.lendableObject}
          >
            <h3>
              {lendableObject.id} - {lendableObject.title}
            </h3>
            <Link to={`/lending/${lendableObject.id}/edit`}>
              <Button>
                <Icon name="create-outline" size={19} />
                Rediger
              </Button>
            </Link>
          </Card>
        ))}
      </Flex>
    </Content>
  );
};

export default LendableObjectsAdmin;
