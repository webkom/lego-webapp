// @flow

import styles from './Search.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cx from 'classnames';
import { debounce } from 'lodash';
import Icon from '../Icon';
import ProfilePicture from '../ProfilePicture';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteDeprecated } from 'app/reducers/search';
import { push } from 'react-router-redux';

const Keyboard = {
  ENTER: 13,
  UP: 38,
  DOWN: 40
};

const quickLinks = [['', 'Interessegrupper'], ['', 'Butikk'], ['', 'Kontakt']];

const SearchResultItem = ({ result, isSelected, onCloseSearch }) =>
  <Link to={result.link} onClick={onCloseSearch}>
    <li className={cx(isSelected && styles.isSelected)}>
      {result.icon &&
        <Icon className={styles.searchResultItemIcon} name={result.icon} />}
      {!result.icon &&
        <ProfilePicture
          size={30}
          user={result}
          style={{ margin: '0px 10px 0px 0px' }}
        />}
      {result.label}
    </li>
  </Link>;

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

          <div className={styles.resultsContainer}>
            <ul className={styles.results}>
              {results.map((result, i) =>
                <SearchResultItem
                  key={i}
                  result={result}
                  onCloseSearch={onCloseSearch}
                  isSelected={i === this.state.selectedIndex - 1}
                />
              )}
            </ul>

            <div className={styles.quickLinks}>
              <ul>
                {quickLinks.map(([href, name]) =>
                  <li key={name}>
                    <Link to={href}>
                      {name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    results: selectAutocompleteDeprecated(state),
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
