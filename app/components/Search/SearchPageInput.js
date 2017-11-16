// @flow
import * as React from 'react';
import Icon from 'app/components/Icon';
import styles from './SearchPageInput.css';

type Props = {
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  value: string,
  isSearching: boolean
};

function SearchPageInput({ isSearching, onChange, value }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.searchIcon}>
        <Icon name="search" />
      </div>

      <input
        placeholder="Hva leter du etter?"
        autoFocus
        className={styles.input}
        onChange={onChange}
        value={value}
      />

      {isSearching && (
        <i className={`${styles.spinner} fa fa-spinner fa-spin`} />
      )}
    </div>
  );
}

export default SearchPageInput;
