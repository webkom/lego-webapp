import {
  Card,
  LoadingIndicator,
  Image,
  Page,
  filterSidebar,
  FilterSection,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchAllLendableObjects } from 'app/actions/LendableObjectActions';
import abakus_icon from 'app/assets/icon-192x192.png';
import TextInput from 'app/components/Form/TextInput';
import { selectAllLendableObjects } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
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
          <h2>{lendableObject.title}</h2>
        </div>
      </Card>
    </Link>
  );
};

const LendableObjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendableObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  const lendableObjects = useAppSelector(selectAllLendableObjects);
  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  const title = 'Utlån';
  return (
    <Page
      title={title}
      sidebar={filterSidebar({
        children: (
          <FilterSection title="Søk">
            <TextInput
              prefix="search"
              placeholder="Søk"
              onChange={(e) =>
                setSearchParams(e.target.value && { search: e.target.value })
              }
            />
          </FilterSection>
        ),
      })}
    >
      <Helmet title={title} />

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
    </Page>
  );
};

export default LendableObjectList;
