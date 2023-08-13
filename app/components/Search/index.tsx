import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import { useState } from 'react';
import { connect } from 'react-redux';
import { autocomplete } from 'app/actions/SearchActions';
import type { Allowed } from 'app/reducers/allowed';
import { selectAutocompleteRedux } from 'app/reducers/search';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import { Keyboard } from 'app/utils/constants';
import QuickLinks from './QuickLinks';
import styles from './Search.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { getAdminLinks, getRegularLinks } from './utils';

type StateProps = {
  allowed: Allowed;
};

type DispatchProps = {
  onQueryChanged: (value: string) => any;
  openSearchRoute: (query: string) => any;
  push: (arg0: string) => void;
};

type Props = StateProps &
  DispatchProps & {
    loggedIn: boolean;
    results: Array<any>;
    onCloseSearch: () => void;
    searching: boolean;
    username?: string;
    updateUserTheme: (username: string, theme: string) => Promise<any>;
  };

const Search = (props: Props) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { allowed, loggedIn, results, onCloseSearch, searching } = props;

  const handleKeyDown = (e) => {
    switch (e.which) {
      case Keyboard.UP:
        e.preventDefault();
        setSelectedIndex(Math.max(-1, selectedIndex - 1));
        break;

      case Keyboard.DOWN:
        e.preventDefault();
        setSelectedIndex(Math.min(props.results.length, selectedIndex + 1));
        break;

      case Keyboard.ENTER: {
        e.preventDefault();
        const result = props.results[selectedIndex];

        if (selectedIndex === -1 || !result) {
          props.openSearchRoute(query);
        } else {
          props.push(result.link);
        }

        props.onCloseSearch();
        break;
      }
    }
  };

  const onQueryChanged = (query) => {
    setQuery(query);
    props.onQueryChanged(query);
  };

  const regularLinks = getRegularLinks({
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

function mapStateToProps(state: RootState): StateProps {
  return {
    allowed: state.allowed,
    results: selectAutocompleteRedux(state),
    searching: state.search.searching,
  };
}

function mapDispatchToProps(dispatch: AppDispatch): DispatchProps {
  return {
    onQueryChanged: debounce((query) => dispatch(autocomplete(query)), 300),
    openSearchRoute: (query) => dispatch(push(`/search?q=${query}`)),
    push: (uri) => dispatch(push(uri)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
