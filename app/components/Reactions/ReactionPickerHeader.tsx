import Flex from 'app/components/Layout/Flex';
import ReactionPickerCategory from './ReactionPickerCategory';
import styles from './ReactionPickerHeader.css';

type Props = {
  categories: string[];
  activeCategory: string | null;
  onCategoryClick: (category: string) => void;
  isSearching: boolean;
};

const ReactionPickerHeader = ({
  categories,
  activeCategory,
  onCategoryClick,
  isSearching,
}: Props) => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    gap={5}
    className={styles.reactionPickerHeader}
  >
    {categories.map((category) => (
      <ReactionPickerCategory
        key={category}
        name={category}
        isActive={category === activeCategory}
        onCategoryClick={onCategoryClick}
        isSearching={isSearching}
      />
    ))}
  </Flex>
);

export default ReactionPickerHeader;
