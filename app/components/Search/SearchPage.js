// @flow

import { useEffect, useState } from 'react';
import SearchPageInput from 'app/components/Search/SearchPageInput';
import SearchPageResults from 'app/components/Search/SearchPageResults';
import { Keyboard } from 'app/utils/constants';
import type { SearchResult } from 'app/reducers/search';
import qs from 'qs';

type Props = {
  searching: boolean,
  location: Object,
  inputRef?: {| current: ?HTMLInputElement |},
  onQueryChanged: (string) => void,
  placeholder?: string,
  results: Array<SearchResult>,
  handleSelect: (string) => Promise<*>,
};

const SearchPage = (props: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [query, setQuery] = useState<mixed>(
    qs.parse(props.location.search, { ignoreQueryPrefix: true }).q || ''
  );

  useEffect(() => {
    // Make sure the selectedIndex is within 0 <= index < results.length:
    const adjustedSelectedIndex = Math.min(
      selectedIndex,
      Math.max(props.results.length - 1, 0)
    );

    setSelectedIndex(adjustedSelectedIndex);
  }, [props.results, selectedIndex, setSelectedIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.results.length === 0) return;
    switch (e.which) {
      case Keyboard.UP:
        e.preventDefault();
        setSelectedIndex(Math.max(0, selectedIndex - 1));
        break;

      case Keyboard.DOWN:
        e.preventDefault();
        setSelectedIndex(Math.min(props.results.length - 1, selectedIndex + 1));
        break;

      case Keyboard.ENTER:
        e.preventDefault();
        handleSelect(props.results[selectedIndex]);
        break;

      default:
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setSelectedIndex(0);
    props.handleSelect(result.username ?? '');
  };

  const handleQueryChange = ({
    target,
  }: SyntheticInputEvent<HTMLInputElement>) => {
    const query = target.value;
    setQuery(query);
    props.onQueryChanged(query);
  };

  const { inputRef, placeholder, searching, results } = props;
  const value = typeof query === 'string' ? query : '';

  return (
    <div>
      <SearchPageInput
        inputRef={inputRef}
        isSearching={searching}
        value={value}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onChange={handleQueryChange}
      />

      <SearchPageResults
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        query={value}
        results={results.filter(({ link }) => link)}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default SearchPage;
