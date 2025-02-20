import { useAppSelector } from '~/redux/hooks';
import styles from './SearchPageInput.module.css';
import type { SyntheticEvent, KeyboardEvent } from 'react';

type Props = {
  inputRef?: {
    current: HTMLInputElement | null | undefined;
  };
  onChange: (arg0: SyntheticEvent<HTMLInputElement>) => void;
  onKeyDown: (arg0: KeyboardEvent) => void;
  placeholder?: string;
  value: string;
};

function SearchPageInput({
  inputRef,
  onKeyDown,
  onChange,
  placeholder = 'Hva leter du etter?',
  value,
}: Props) {
  const isSearching = useAppSelector((state) => state.search.searching);
  const icon = isSearching ? 'fa-circle-o-notch fa-spin' : 'fa-search';

  return (
    <div className={styles.container}>
      <div className={styles.searchIcon}>
        <i className={`fa ${icon} ${styles.icon}`} />
      </div>

      <input
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus
        ref={inputRef}
        className={styles.input}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default SearchPageInput;
