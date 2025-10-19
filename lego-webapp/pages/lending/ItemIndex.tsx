import {
  LoadingIndicator,
  Icon,
  BaseCard,
  CardFooter,
  Flex,
} from '@webkom/lego-bricks';
import { Contact, ImageOff, Package, Tag, FolderOpen } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { readmeIfy } from '../../components/ReadmeLogo';
import { useAppSelector } from '../../redux/hooks';
import { selectGroupsByIds } from '../../redux/slices/groups';
import { LENDABLE_CATEGORY } from '../../utils/constants';
import truncateString from '../../utils/truncateString';
import styles from './ItemIndex.module.css';
import type { ListLendableObject } from '../../redux/models/LendableObject';

type Props = {
  lendableObjects: ListLendableObject[];
  isFetching: boolean;
  searchQuery: string;
};

const LendableObject = ({
  lendableObject,
}: {
  lendableObject: ListLendableObject;
}) => {
  const responsibleGroups = useAppSelector((state) =>
    selectGroupsByIds(state, lendableObject.responsibleGroups),
  );

  const formattedGroups = formatGroups(responsibleGroups) || '';

  return (
    <a href={`/lending/${lendableObject.id}`}>
      <BaseCard hoverable className={styles.lendableObjectCard}>
        <div className={styles.lendableObjectImageContainer}>
          {lendableObject.image ? (
            <img
              className={styles.lendableObjectImage}
              src={lendableObject.image}
              alt={`${lendableObject.title}`}
            />
          ) : (
            <Icon
              className={styles.defaultObjectImage}
              iconNode={<ImageOff />}
              size={100}
            />
          )}
        </div>
        <CardFooter className={styles.lendableObjectInfobox}>
          <Flex>
            {/* Flex is needed for css title truncation */}
            <h3 title={lendableObject.title}>{lendableObject.title}</h3>
          </Flex>
          <p title={formattedGroups}>
            <Icon iconNode={<Contact />} size={18} />
            {readmeIfy(truncateString(formattedGroups, 15))}
          </p>
          <p>
            {<Icon iconNode={<Package />} size={18} />}
            {lendableObject.location}
          </p>
          <p>
            {<Icon iconNode={<Tag />} size={18} />}
            {LENDABLE_CATEGORY[lendableObject.category]}
          </p>
        </CardFooter>
      </BaseCard>
    </a>
  );
};

const formatGroups = (groups: { name: string }[]) => {
  return groups.length > 0 ? groups.map((g) => g.name).join(', ') : 'Ukjent';
};

const ItemIndex = ({ lendableObjects, isFetching, searchQuery }: Props) => {
  return (
    <>
      <h3>Tilgjengelig utstyr</h3>
      <LoadingIndicator loading={isFetching}>
        {lendableObjects.length ? (
          <div className={styles.lendableObjectsContainer}>
            {lendableObjects.map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            iconNode={<FolderOpen />}
            className={styles.emptyLendableObjectsContainer}
            body={
              searchQuery ? (
                <span>
                  Fant ingen treff for <em>{searchQuery}</em>
                </span>
              ) : (
                <span>Ingen tilgjengelige utlånsobjekter</span>
              )
            }
          />
        )}
      </LoadingIndicator>
    </>
  );
};

export default ItemIndex;
