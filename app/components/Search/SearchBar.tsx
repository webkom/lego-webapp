import { Flex, Icon } from '@webkom/lego-bricks';
import { Search, X } from 'lucide-react';
import styles from './Search.css';
import type { Dispatch, KeyboardEventHandler, SetStateAction } from 'react';

type Props = {
  query: string;
  onQueryChanged: Dispatch<SetStateAction<string>>;
  onCloseSearch: () => void;
  handleKeyDown: KeyboardEventHandler<HTMLElement>;
};

const searchFields = [
  {
    className: styles.inputElementNormal,
    autoFocus: true,
  },
  {
    className: styles.inputElementMobile,
    autoFocus: false,
  },
];

const SearchBar = ({
  query,
  onQueryChanged,
  onCloseSearch,
  handleKeyDown,
}: Props) => {
  return (
    <Flex
      className={styles.inputContainer}
      justifyContent="space-between"
      alignItems="center"
    >
      <div className={styles.searchIcon}>
        <Icon iconNode={<Search />} size={30} />
      </div>
      {searchFields.map((k) => (
        <input
          key={`search-field-${k.autoFocus ? 'on' : 'off'}`}
          onKeyDown={handleKeyDown}
          className={k.className}
          onChange={(e) => onQueryChanged(e.target.value)}
          value={query}
          size={1}
          placeholder="Hva leter du etter?"
          ref={(input) => input && k.autoFocus && input.focus()}
        />
      ))}

      <Icon
        onClick={onCloseSearch}
        iconNode={<X />}
        size={30}
        data-test-id="closeButton"
      />
    </Flex>
  );
};

export default SearchBar;
