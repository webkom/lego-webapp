import { debounce } from 'lodash';
import { useState } from 'react';
import { push } from 'redux-first-history';
import { autocomplete, toggleSearch } from 'app/actions/SearchActions';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectAutocompleteRedux } from 'app/reducers/search';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Keyboard } from 'app/utils/constants';
import QuickLinks from './QuickLinks';
import styles from './Search.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { getExternalLinks, getAdminLinks, getRegularLinks } from './utils';

const Search = () => {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const results = useAppSelector(selectAutocompleteRedux);
  const searching = useAppSelector((state) => state.search.searching);
  const allowed = useAppSelector((state) => state.allowed);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onCloseSearch = () => dispatch(toggleSearch());

  const handleKeyDown = (e) => {
    switch (e.which) {
      case Keyboard.UP:
        e.preventDefault();
        setSelectedIndex(Math.max(-1, selectedIndex - 1));
        break;

      case Keyboard.DOWN:
        e.preventDefault();
        setSelectedIndex(Math.min(results.length, selectedIndex + 1));
        break;

      case Keyboard.ENTER: {
        e.preventDefault();
        const result = results[selectedIndex];

        if (selectedIndex === -1 || !result) {
          dispatch(push(`/search?q=${query}`));
        } else {
          result.link && dispatch(push(result.link));
        }

        onCloseSearch();
        break;
      }
    }
  };

  const onQueryChanged = debounce((query) => {
    setQuery(query);
    dispatch(autocomplete(query));
  }, 300);

  const regularLinks = getRegularLinks({
    allowed,
    loggedIn,
  });

  const externalLinks = getExternalLinks({
    allowed,
    loggedIn,
  });

  const adminLinks = getAdminLinks({
    allowed,
    loggedIn,
  });

  return (
    <div tabIndex={-1}>
      <SearchBar
        query={query}
        handleKeyDown={handleKeyDown}
        onQueryChanged={onQueryChanged}
        onCloseSearch={onCloseSearch}
      />
      <div className={styles.resultsContainer}>
        {query.length > 0 && (
          <SearchResults
            results={results}
            onCloseSearch={onCloseSearch}
            searching={searching}
            selectedIndex={selectedIndex}
          />
        )}
        <div className={styles.sidePanel}>
          <QuickLinks
            title="Sider"
            links={regularLinks}
            onCloseSearch={onCloseSearch}
          />
          {externalLinks.length > 0 && (
            <QuickLinks
              title="Andre tjenester"
              links={externalLinks}
              onCloseSearch={onCloseSearch}
            />
          )}
          {adminLinks.length > 0 && (
            <QuickLinks
              title="Admin"
              links={adminLinks}
              onCloseSearch={onCloseSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
