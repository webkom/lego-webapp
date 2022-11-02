// @flow
import styles from './SearchPageInput.css';

type Props = {
  inputRef?: {| current: ?HTMLInputElement |},
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  onKeyDown: (KeyboardEvent) => void,
  placeholder?: string,
  value: string,
  isSearching: boolean,
};

function SearchPageInput({
  inputRef,
  isSearching,
  onKeyDown,
  onChange,
  placeholder = 'Hva leter du etter?',
  value,
}: Props) {
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
