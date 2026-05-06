import { useAppSelector } from '~/redux/hooks';
import styles from './SearchPageInput.module.css';
import type { KeyboardEvent, Ref, ChangeEventHandler, KeyboardEventHandler } from 'react';

type Props = {
  inputRef?: Ref<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
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
