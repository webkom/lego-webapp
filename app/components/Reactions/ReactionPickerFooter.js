// @flow

import React from 'react';
import styles from './ReactionPickerFooter.css';

type Props = {
  onSearch: (searchString: string) => void
};

const ReactionPickerFooter = ({ onSearch }: Props) => (
  <div className={styles.reactionPickerFooter}>
    <input
      className={styles.reactionPickerSearch}
      onInput={e => onSearch(e.target.value)}
      placeholder="Søk..."
      maxLength="15"
      autoFocus
    />
  </div>
);

export default ReactionPickerFooter;
