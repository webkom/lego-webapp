// @flow

import styles from './Search.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import Icon from '../Icon';
import SearchResults from './SearchResults';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteRedux } from 'app/reducers/search';
import { push } from 'react-router-redux';
import { Keyboard } from 'app/utils/constants';

const navigationLinks = [
  ['/articles', 'Artikler'],
  ['/announcements', 'Kunngjøringer'],
  ['/bdb', 'BDB'],
  ['http://readme.abakus.no', 'readme'],
  ['/interestgroups', 'Interessegrupper'],
  ['/meetings', 'Møter'],
  ['/quotes', 'Sitater'],
  ['/users/me', 'Profil'],
  ['https://shop.abakus.no/', 'Abashop'],
  ['/joblistings', 'Jobbannonser']
].sort((a, b) => a[1].localeCompare(b[1]));

const adminLinks = [
  ['/admin/groups', 'Grupper'],
  ['/email', 'E-post']
].sort((a, b) => a[1].localeCompare(b[1]));

type Props = {
  results: Array<any>,
  onCloseSearch: () => any,
  onQueryChanged: (value: string) => any,
  openSearchRoute: (query: string) => any,
  searching: boolean
};

type State = {
  query: string,
  selectedIndex: number
};

class Search extends Component {
  props: Props;

  state: State = {
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

      case Keyboard.ENTER:
        e.preventDefault();
        if (this.state.selectedIndex === 0) {
          this.props.openSearchRoute(this.state.query);
        } else {
          const result = this.props.results[this.state.selectedIndex - 1];
          this.props.push(result.link);
        }
        this.props.onCloseSearch();
        break;

      default:
    }
  };

  onQueryChanged = query => {
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { results, onCloseSearch, searching } = this.props;
    const { query, selectedIndex } = this.state;
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex={-1}>
        <div className={styles.overlay}>
          <div className={styles.inputContainer}>
            <div className={styles.searchIcon}>
              <Icon name="search" />
            </div>
            <input
              onChange={e => this.onQueryChanged(e.target.value)}
              value={this.state.query}
              type="search"
              size="1"
              placeholder="Hva leter du etter?"
              autoFocus
            />

            <button
              type="button"
              className={styles.closeButton}
              onClick={onCloseSearch}
            >
              <Icon name={searching ? 'refresh' : 'close'} />
            </button>
          </div>

          <SearchResults
            query={query}
            results={results}
            navigationLinks={navigationLinks}
            adminLinks={adminLinks}
            onCloseSearch={onCloseSearch}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    results: selectAutocompleteRedux(state),
    searching: state.search.searching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onQueryChanged: debounce(query => dispatch(autocomplete(query)), 300),
    openSearchRoute: query => dispatch(push(`/search?q=${query}`)),
    push: uri => dispatch(push(uri))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
