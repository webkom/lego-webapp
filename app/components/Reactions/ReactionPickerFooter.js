// @flow

import React from 'react';
import styles from './ReactionPickerFooter.css';

type Props = {
  onSearch: (searchString: string) => void
};

const ReactionPickerFooter = ({ onSearch }: Props) => (
  <div className={styles.reactionPickerFooter}>
    {[
      {
        style: styles.reactionPickerSearchAutoComplete,
        autoFocus: true
      },
      {
        style: styles.reactionPickerSearchNormal,
        autoFocus: false
      }
    ].map(k => {
      return (
        <input
          key={`reaction-search-autofocus-${k.autoFocus}`}
          className={k.style}
          onInput={e => onSearch(e.target.value)}
          placeholder="Søk..."
          maxLength="15"
          ref={input => input && k.autoFocus && input.focus()}
        />
      );
    })}
  </div>
);

export default ReactionPickerFooter;
