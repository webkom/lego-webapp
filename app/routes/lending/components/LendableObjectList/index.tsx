import {
  Card,
  LoadingIndicator,
  Image,
  Page,
  filterSidebar,
  FilterSection,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { FolderOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import abakus_icon from 'app/assets/icon-192x192.png';
import EmptyState from 'app/components/EmptyState';
import TextInput from 'app/components/Form/TextInput';
import { selectAllLendableObjects } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import styles from './LendableObjectList.module.css';
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
          <h4>{lendableObject.title}</h4>
        </div>
      </Card>
    </Link>
  );
};

const LendableObjectList = () => {
  const { query, setQueryValue } = useQuery({
    search: '',
  });

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendableObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  const lendableObjects = useAppSelector(selectAllLendableObjects);
  const actionGrant = useAppSelector(
    (state) => state.lendableObjects.actionGrant,
  );
  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  const filteredLendableObjects = lendableObjects.filter((lendableObjects) =>
    lendableObjects.title.toLowerCase().includes(query.search.toLowerCase()),
  );

  const title = 'Utlån';
  return (
    <Page
      title={title}
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
              onChange={(e) => setQueryValue('search')(e.target.value)}
            />
          </FilterSection>
        ),
      })}
    >
      <Helmet title={title} />

      <LoadingIndicator loading={fetching}>
        {filteredLendableObjects.length ? (
          <div className={styles.lendableObjectsContainer}>
            {filteredLendableObjects.map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            iconNode={<FolderOpen />}
            body={
              query.search ? (
                <span>
                  Fant ingen treff på søket <em>{query.search}</em>
                </span>
              ) : (
                <span>Ingen tilgjengelige utlånsobjekter</span>
              )
            }
          />
        )}
      </LoadingIndicator>
    </Page>
  );
};

export default LendableObjectList;
