import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './ReactionPickerCategory.css';

type Props = {
  isActive: boolean;
  name: string;
  onCategoryClick: (category: string) => void;
  isSearching: boolean;
};

const mapCategoryNameToIcon = (name) => {
  switch (name) {
    case 'people':
      return 'happy';

    case 'animals_and_nature':
      return 'leaf';

    case 'food_and_drink':
      return 'beer';

    case 'activity':
      return 'football';

    case 'travel_and_places':
      return 'airplane';

    case 'objects':
      return 'bulb';

    case 'symbols':
      return 'heart';

    case 'flags':
      return 'flag';

    default:
      return 'help';
  }
};

const ReactionPickerCategory = ({
  isActive,
  name,
  onCategoryClick,
  isSearching,
}: Props) => {
  const categoryClasses = [styles.category];

  if (isActive) {
    categoryClasses.push(styles.isActiveCategory);
  }

  if (isSearching) {
    categoryClasses.push(styles.isSearching);
  }

  return (
    <div title={name} onClick={() => onCategoryClick(name)}>
      <div className={styles.container}>
        <div className={cx(categoryClasses)}>
          <Icon
            size={22}
            name={`${mapCategoryNameToIcon(name)}${
              !isActive ? '-outline' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ReactionPickerCategory;
