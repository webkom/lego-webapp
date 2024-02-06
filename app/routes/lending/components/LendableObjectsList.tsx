import { Button, Card, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import { Image } from 'app/components/Image';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectLendableObjects } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './LendableObjectsList.css';
import { LendingRequest, status } from './LendingRequest';
import type { ListLendableObject } from 'app/store/models/LendableObject';

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
          src={lendableObject.image}
          alt={`${lendableObject.title}`}
        />
        <div className={styles.lendableObjectFooter}>
          <h2>{lendableObject.title}</h2>
        </div>
      </Card>
    </Link>
  );
};

export const LendableObjectsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFetchMore, setShowFetchMore] = useState(false);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchObjects',
    () => dispatch(fetchAllLendableObjects()),
    []
  );

  const lendableObjects = useAppSelector((state) =>
    selectLendableObjects(state)
  );
  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  const myRequests = [
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
      startTime: moment().subtract({ days: 2 }),
      endTime: moment().subtract({ days: 1 }),
      message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
      approved: false,
      status: status.DENIED,
      lendableObject: {
        id: 2,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
    {
      id: 3,
      user: 'Test Testesen',
      startTime: moment().add({ hours: 2 }),
      endTime: moment().add({ hours: 4 }),
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
      id: 3,
      user: 'Test Testesen',
      startTime: moment().add({ hours: 2 }),
      endTime: moment().add({ hours: 4 }),
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

  return (
    <Content>
      <Helmet title="Utlån" />
      <NavigationTab title="Utlån">
        <NavigationLink to={`/lending/admin`}>Admin</NavigationLink>
      </NavigationTab>

      <h2>Mine forespørsler</h2>
      <div className={styles.myRequestsList}>
        {myRequests.length === 0 ? (
          <p className="secondaryFontColor">Her var det tomt!</p>
        ) : (
          myRequests
            .filter((request) =>
              request.endTime.isAfter(moment().startOf('day'))
            )
            // sorting?
            .map((request) => (
              <LendingRequest key={request.id} request={request} />
            ))
        )}
      </div>

      {myRequests.length !== 0 &&
        (showFetchMore ? (
          <Button>Hent fler</Button>
        ) : (
          <Button onClick={() => setShowFetchMore(true)}>
            Hent gamle forespørsler
          </Button>
        ))}

      <h2 style={{ marginTop: '30px' }}>Utlånsobjekter</h2>
      <TextInput
        className={styles.searchBar}
        prefix="search"
        placeholder="Søk etter utlånsobjekter"
        onChange={(e) =>
          setSearchParams(e.target.value && { search: e.target.value })
        }
      />
      <div className={styles.lendableObjectsContainer}>
        <LoadingIndicator loading={fetching}>
          {lendableObjects
            .filter((lendableObjects) =>
              searchParams.get('search')
                ? lendableObjects.title
                    .toLowerCase()
                    .includes((searchParams.get('search') || '').toLowerCase())
                : true
            )
            .map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
        </LoadingIndicator>
      </div>
    </Content>
  );
};

export default LendableObjectsList;
