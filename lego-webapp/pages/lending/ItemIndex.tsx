import {
  Icon,
  BaseCard,
  CardFooter,
  Flex,
  LinkButton,
  Skeleton,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  Contact,
  ImageOff,
  Package,
  Tag,
  FolderOpen,
  Plus,
} from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { readmeIfy } from '../../components/ReadmeLogo';
import { useAppSelector } from '../../redux/hooks';
import { selectGroupsByIds } from '../../redux/slices/groups';
import { LENDABLE_CATEGORY } from '../../utils/constants';
import truncateString from '../../utils/truncateString';
import { categoryIconMap } from './FilterSearch';
import styles from './ItemIndex.module.css';
import type { ListLendableObject } from '../../redux/models/LendableObject';

type Props = {
  lendableObjects: ListLendableObject[];
  isFetching: boolean;
  searchQuery: string;
  canCreate: boolean;
  className?: string;
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
      <BaseCard hoverable shadow className={styles.lendableObjectCard}>
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
            <h3 title={lendableObject.title}>
              {truncateString(lendableObject.title, 25)}
            </h3>
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

const CreateLendableObjectCard = () => {
  const categoryKeys = Object.keys(LENDABLE_CATEGORY);
  const backgroundIcons = [...categoryKeys, ...categoryKeys];
  return (
    <BaseCard className={styles.createNewContainer}>
      <div className={styles.animatedBackground}>
        {backgroundIcons.map((category, index) => (
          <div
            key={index}
            className={cx(styles.animatedBackgroundIcon, styles.x)}
            style={{
              animationDelay: `${Math.random() * 10}s`,
              transform: `translate(${(Math.round(Math.random()) * 2 - 1) * (Math.random() * 50)}%, ${(Math.round(Math.random()) * 2 - 1) * (Math.random() * 50)}%)`,
            }}
          >
            <Icon iconNode={categoryIconMap[category]} size={32} />
          </div>
        ))}
      </div>
      <LinkButton round className={styles.createNewIcon} href="/lending/new">
        <Icon iconNode={<Plus />} size={35} />
      </LinkButton>
      <p>Lag utlånsobjekt</p>
    </BaseCard>
  );
};

const formatGroups = (groups: { name: string }[]) => {
  return groups.length > 0 ? groups.map((g) => g.name).join(', ') : 'Ukjent';
};

const ItemIndex = ({
  lendableObjects,
  isFetching,
  searchQuery,
  canCreate,
  className,
}: Props) => {
  return (
    <div className={className}>
      <h3>Tilgjengelig utstyr</h3>
      <div className={styles.lendableObjectsContainer}>
        {isFetching && (
          <Skeleton
            array={6}
            height={304.783}
            className={styles.skeletonCard}
          />
        )}

        {!isFetching && lendableObjects.length > 0 && (
          <>
            {canCreate && <CreateLendableObjectCard />}
            {lendableObjects.map((lendableObject) => (
              <LendableObject
                key={lendableObject.id}
                lendableObject={lendableObject}
              />
            ))}
          </>
        )}

        {!isFetching && lendableObjects.length === 0 && (
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
      </div>
    </div>
  );
};
export default ItemIndex;
