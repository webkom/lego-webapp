import cx from 'classnames';
import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';
import { navigate } from 'vike/client/router';
import { autocomplete, toggleSearch } from '~/redux/actions/SearchActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectAutocomplete } from '~/redux/slices/search';
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

const CASCADE_STAGGER_MS = 12;
const MAX_CASCADE_WINDOW_MS = 200;

const getCascadeStepMs = (itemCount: number) =>
  Math.min(
    CASCADE_STAGGER_MS,
    MAX_CASCADE_WINDOW_MS / Math.max(itemCount - 1, 1),
  );

type SearchProps = {
  closing: boolean;
  onClosed: () => void;
};

const Search = ({ closing, onClosed }: SearchProps) => {
  const loggedIn = useIsLoggedIn();
  const results = useAppSelector(selectAutocomplete);
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

  const externalLinksCascadeStart = regularLinks.length + 1;
  const adminLinksCascadeStart =
    externalLinksCascadeStart +
    (externalLinks.length > 0 ? externalLinks.length + 1 : 0);
  const quickLinkItemCount =
    adminLinksCascadeStart +
    (adminLinks.length > 0 ? adminLinks.length + 1 : 0);
  const quickLinksCascadeStepMs = getCascadeStepMs(quickLinkItemCount);
  const filteredLinksCascadeStepMs = getCascadeStepMs(filteredLinks.length + 1);

  return (
    <div
      className={cx(styles.wrapper, closing && styles.closing)}
      data-test-id="search-overlay"
      onAnimationEnd={(e) => {
        if (closing && e.target === e.currentTarget) {
          onClosed();
        }
      }}
      tabIndex={-1}
    >
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
                    cascadeStartIndex={0}
                    cascadeStepMs={filteredLinksCascadeStepMs}
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
                cascadeStartIndex={0}
                cascadeStepMs={quickLinksCascadeStepMs}
              />
              {externalLinks.length > 0 && (
                <QuickLinks
                  title="Andre tjenester"
                  links={externalLinks}
                  onCloseSearch={onCloseSearch}
                  cascadeStartIndex={externalLinksCascadeStart}
                  cascadeStepMs={quickLinksCascadeStepMs}
                />
              )}
              {adminLinks.length > 0 && (
                <QuickLinks
                  title="Admin"
                  links={adminLinks}
                  onCloseSearch={onCloseSearch}
                  cascadeStartIndex={adminLinksCascadeStart}
                  cascadeStepMs={quickLinksCascadeStepMs}
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
