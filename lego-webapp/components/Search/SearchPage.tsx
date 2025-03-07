import { useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import SearchPageInput from '~/components/Search/SearchPageInput';
import SearchPageResults from '~/components/Search/SearchPageResults';
import { Keyboard } from '~/utils/constants';
import type { ChangeEventHandler, KeyboardEvent } from 'react';
import type { SearchResult } from '~/redux/slices/search';

type Props<T> = {
  inputRef?: {
    current: HTMLInputElement | null | undefined;
  };
  onQueryChanged: (arg0: string) => void;
  placeholder?: string;
  results: Array<T>;
  handleSelect: (arg0: T) => Promise<void>;
};

const SearchPage = <SearchType extends SearchResult>(
  props: Props<SearchType>,
) => {
  const pageContext = usePageContext();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [query, setQuery] = useState(pageContext.urlParsed.search.q);

  useEffect(() => {
    // Make sure the selectedIndex is within 0 <= index < results.length:
    const adjustedSelectedIndex = Math.min(
      selectedIndex,
      Math.max(props.results.length - 1, 0),
    );
    setSelectedIndex(adjustedSelectedIndex);
  }, [props.results, selectedIndex, setSelectedIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.results.length === 0) return;

    switch (e.key) {
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

  const handleSelect = (result: SearchType) => {
    setQuery('');
    setSelectedIndex(0);
    props.handleSelect(result);
  };

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const query = target.value;
    setQuery(query);
    props.onQueryChanged(query);
  };

  const { inputRef, placeholder, results } = props;
  return (
    <div>
      <SearchPageInput
        inputRef={inputRef}
        value={query}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onChange={handleQueryChange}
      />

      <SearchPageResults
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        query={query}
        results={results.filter(({ link }) => link)}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default SearchPage;
