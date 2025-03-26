import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';
import { navigate } from 'vike/client/router';
import { autocomplete, toggleSearch } from '~/redux/actions/SearchActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectAutocompleteRedux } from '~/redux/slices/search';
import { Keyboard } from '~/utils/constants';
import QuickLinks from './QuickLinks';
import styles from './Search.module.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import {
  getExternalLinks,
  getAdminLinks,
  getRegularLinks,
  getAllLinksFiltered,
} from './utils';

const Search = () => {
  const loggedIn = useIsLoggedIn();
  const results = useAppSelector(selectAutocompleteRedux);
  const searching = useAppSelector((state) => state.search.searching);
  const allowed = useAppSelector((state) => state.allowed);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dispatch = useAppDispatch();

  const debouncedAutoComplete = useMemo(
    () => debounce((query) => dispatch(autocomplete(query)), 300),
    [dispatch],
  );
  const onCloseSearch = () => dispatch(toggleSearch());

  const handleKeyDown = (e) => {
    switch (e.key) {
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
          navigate(`/search?q=${query}`);
        } else {
          result.link && navigate(result.link);
        }

        onCloseSearch();
        break;
      }
    }
  };

  const onQueryChanged = (query) => {
    setQuery(query);
    debouncedAutoComplete(query);
  };

  const { regularLinks, externalLinks, adminLinks } = useMemo(
    () => ({
      regularLinks: getRegularLinks({
        allowed,
        loggedIn,
      }),
      externalLinks: getExternalLinks({
        allowed,
        loggedIn,
      }),
      adminLinks: getAdminLinks({
        allowed,
        loggedIn,
      }),
    }),
    [allowed, loggedIn],
  );

  const filteredLinks = useMemo(
    () =>
      getAllLinksFiltered(
        {
          allowed,
          loggedIn,
        },
        query,
      ),
    [allowed, loggedIn, query],
  );

  return (
    <div className={styles.wrapper} tabIndex={-1}>
      <div className={styles.content}>
        <SearchBar
          query={query}
          handleKeyDown={handleKeyDown}
          onQueryChanged={onQueryChanged}
        />
        <div className={styles.resultsContainer}>
          {query.length > 0 ? (
            <>
              <SearchResults
                results={results}
                onCloseSearch={onCloseSearch}
                searching={searching}
                selectedIndex={selectedIndex}
                query={query}
              />
              {filteredLinks.length > 0 && (
                <div className={styles.sidePanel}>
                  <QuickLinks
                    title="Sider"
                    links={filteredLinks}
                    onCloseSearch={onCloseSearch}
                  />
                </div>
              )}
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
