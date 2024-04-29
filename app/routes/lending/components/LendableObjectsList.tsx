import { Button, Card, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import abakus_icon from 'app/assets/icon-192x192.png';
import { Content } from 'app/components/Content';
import TextInput from 'app/components/Form/TextInput';
import { Image } from 'app/components/Image';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectAllLendableObjects } from 'app/reducers/lendableObjects';
import { selectAllLendingRequests } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './LendableObjectsList.css';
import RequestItem from './RequestItem';
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
          src={lendableObject.image || abakus_icon}
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
  const [showOldRequests, setShowOldRequests] = useState(false);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  const lendableObjects = useAppSelector((state) =>
    selectAllLendableObjects(state),
  );
  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  usePreparedEffect(
    'fetchRequests',
    () => dispatch(fetchAllLendingRequests()),
    [],
  );

  const lendingRequests = useAppSelector((state) =>
    selectAllLendingRequests(state),
  );

  const fetchingRequests = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  useEffect(() => {
    console.log(lendingRequests);
  }, [lendingRequests]);

  return (
    <Content>
      <Helmet title="Utlån" />
      <NavigationTab title="Utlån">
        <NavigationLink to="/lending/admin">Admin</NavigationLink>
      </NavigationTab>

      <h2>Mine forespørsler</h2>
      <div className={styles.myRequestsList}>
        <LoadingIndicator loading={fetchingRequests}>
          {lendingRequests.length === 0 ? (
            <p className="secondaryFontColor">Her var det tomt!</p>
          ) : (
            lendingRequests
              // TODO: does not work atm..
              // .sort((a, b) => b.endDate.diff(a.endDate))
              // .filter(
              //   (req) =>
              //     showOldRequests || req.endDate.isAfter(moment().startOf('day'))
              // )
              .map((request) => (
                <RequestItem key={request.id} request={request} />
              ))
          )}
        </LoadingIndicator>
      </div>

      {lendingRequests.length !== 0 && (
        <Button onClick={() => setShowOldRequests((prev) => !prev)}>
          {showOldRequests
            ? 'Skjul gamle forespørsler'
            : 'Hent gamle forsepørsler'}
        </Button>
      )}

      <h2 style={{ marginTop: '30px' }}>Utlånsobjekter</h2>
      <TextInput
        className={styles.searchBar}
        prefix="search"
        placeholder="Søk etter utlånsobjekter"
        onChange={(e) =>
          setSearchParams(e.target.value && { search: e.target.value })
        }
      />
      <LoadingIndicator loading={fetching}>
        <div className={styles.lendableObjectsContainer}>
          {lendableObjects
            .filter((lendableObjects) =>
              searchParams.get('search')
                ? lendableObjects.title
                    .toLowerCase()
                    .includes((searchParams.get('search') || '').toLowerCase())
                : true,
            )
            .map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
        </div>
      </LoadingIndicator>
    </Content>
  );
};

export default LendableObjectsList;
