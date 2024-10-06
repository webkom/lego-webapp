import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  Beer,
  CircleHelp,
  Flag,
  Heart,
  LandPlot,
  Leaf,
  Lightbulb,
  Plane,
  Smile,
} from 'lucide-react';
import { getTheme } from 'app/utils/themeUtils';
import styles from './ReactionPickerCategory.css';

type Props = {
  isActive: boolean;
  name: string;
  onCategoryClick: (category: string) => void;
  isSearching: boolean;
};

const mapCategoryNameToIcon = (name, isActive) => {
  const fill = isActive
    ? getTheme() === 'dark'
      ? 'var(--color-blue-5)'
      : 'var(--color-blue-6)'
    : 'transparent';

  switch (name) {
    case 'people':
      return <Smile fill={fill} />;

    case 'animals_and_nature':
      return <Leaf fill={fill} />;

    case 'food_and_drink':
      return <Beer fill={fill} />;

    case 'activity':
      return <LandPlot fill={fill} />;

    case 'travel_and_places':
      return <Plane fill={fill} />;

    case 'objects':
      return <Lightbulb fill={fill} />;

    case 'symbols':
      return <Heart fill={fill} />;

    case 'flags':
      return <Flag fill={fill} />;

    default:
      return <CircleHelp fill={fill} />;
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
          <Icon size={22} iconNode={mapCategoryNameToIcon(name, isActive)} />
        </div>
      </div>
    </div>
  );
};

export default ReactionPickerCategory;
