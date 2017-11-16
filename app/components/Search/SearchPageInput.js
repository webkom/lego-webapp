// @flow
import * as React from 'react';
import styles from './SearchPageInput.css';

type Props = {
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  value: string,
  isSearching: boolean
};

function SearchPageInput({ isSearching, onChange, value }: Props) {
  const icon = isSearching ? 'fa-circle-o-notch fa-spin' : 'fa-search';
  return (
    <div className={styles.container}>
      <div className={styles.searchIcon}>
        <i className={`fa ${icon} ${styles.icon}`} />
      </div>

      <input
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
