// @flow
import * as React from 'react';
import styles from './SearchPageInput.css';

type Props = {
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  onKeyDown: KeyboardEvent => void,
  value: string,
  isSearching: boolean
};

function SearchPageInput({ isSearching, onKeyDown, onChange, value }: Props) {
  const icon = isSearching ? 'fa-circle-o-notch fa-spin' : 'fa-search';
  return (
    <div className={styles.container}>
      <div className={styles.searchIcon}>
        <i className={`fa ${icon} ${styles.icon}`} />
      </div>

      <input
        onKeyDown={onKeyDown}
        placeholder="Hva leter du etter?"
        autoFocus
        className={styles.input}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default SearchPageInput;
