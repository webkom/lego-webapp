// @flow

import styles from './Search.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import Icon from '../Icon';
import SearchResults from './SearchResults';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteRedux } from 'app/reducers/search';
import { push } from 'connected-react-router';
import { Keyboard } from 'app/utils/constants';
import type { State as ReducerState } from 'app/types';
import type { Allowed } from 'app/reducers/allowed';
import { getAdminLinks, getRegularLinks } from './utils';

type StateProps = {
  allowed: Allowed
};

type DispatchProps = {
  onQueryChanged: (value: string) => any,
  openSearchRoute: (query: string) => any,
  push: string => void
};

type Props = StateProps &
  DispatchProps & {
    loggedIn: boolean,
    results: Array<any>,
    onCloseSearch: () => any,
    searching: boolean
  };

type State = {
  query: string,
  selectedIndex: number
};

class Search extends Component<Props, State> {
  state = {
    query: '',
    selectedIndex: 0
  };

  handleKeyDown = e => {
    switch (e.which) {
      case Keyboard.UP:
        e.preventDefault();
        this.setState({
          selectedIndex: Math.max(0, this.state.selectedIndex - 1)
        });
        break;

      case Keyboard.DOWN:
        e.preventDefault();
        this.setState({
          selectedIndex: Math.min(
            this.props.results.length,
            this.state.selectedIndex + 1
          )
        });
        break;

      case Keyboard.ENTER: {
        e.preventDefault();
        const result = this.props.results[this.state.selectedIndex - 1];
        if (this.state.selectedIndex === 0 || !result) {
          this.props.openSearchRoute(this.state.query);
        } else {
          this.props.push(result.link);
        }
        this.props.onCloseSearch();
        break;
      }
      default:
    }
  };

  onQueryChanged = query => {
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { allowed, loggedIn, results, onCloseSearch, searching } = this.props;
    const { query, selectedIndex } = this.state;
    const regularLinks = getRegularLinks({ allowed, loggedIn });
    const adminLinks = getAdminLinks({ allowed, loggedIn });
    const searchFields = [
      {
        style: styles.inputElementNormal,
        autoFocus: true
      },
      {
        style: styles.inputElementMobile,
        autoFocus: false
      }
    ];
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex={-1}>
        <div className={styles.overlay}>
          <div className={styles.inputContainer}>
            <div className={styles.searchIcon}>
              <Icon name="search" size={30} />
            </div>
            {searchFields.map(k => (
              <input
                key={`search-field-${k.autoFocus ? 'on' : 'off'}`}
                className={k.style}
                onChange={e => this.onQueryChanged(e.target.value)}
                value={this.state.query}
                type="search"
                size="1"
                placeholder="Hva leter du etter?"
                ref={input => input && k.autoFocus && input.focus()}
              />
            ))}

            <button
              type="button"
              className={styles.closeButton}
              onClick={onCloseSearch}
            >
              <Icon name={searching ? 'refresh' : 'close'} size={30} />
            </button>
          </div>

          <SearchResults
            query={query}
            searching={searching}
            results={results.filter(({ link }) => link)}
            navigationLinks={regularLinks}
            adminLinks={adminLinks}
            onCloseSearch={onCloseSearch}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: ReducerState): StateProps {
  return {
    allowed: state.allowed,
    results: selectAutocompleteRedux(state),
    searching: state.search.searching
  };
}

function mapDispatchToProps(dispatch: $FlowFixMe): DispatchProps {
  return {
    onQueryChanged: debounce(query => dispatch(autocomplete(query)), 300),
    openSearchRoute: query => dispatch(push(`/search?q=${query}`)),
    push: uri => dispatch(push(uri))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
