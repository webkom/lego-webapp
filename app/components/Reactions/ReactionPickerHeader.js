// @flow

import React from 'react';
import styles from './ReactionPickerHeader.css';
import ReactionPickerCategory from './ReactionPickerCategory';

type Props = {
  categories: Array<string>,
  activeCategory: string | null,
  onCategoryClick: (category: string) => void,
};

const ReactionPickerHeader = ({
  categories,
  activeCategory,
  onCategoryClick,
}: Props) => (
  <div className={styles.reactionPickerHeader}>
    {categories.map((category) => (
      <ReactionPickerCategory
        key={category}
        name={category}
        isActive={category === activeCategory}
        onCategoryClick={onCategoryClick}
      />
    ))}
  </div>
);

export default ReactionPickerHeader;
