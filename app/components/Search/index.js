// @flow

import styles from './Search.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cx from 'classnames';
import { debounce } from 'lodash';
import Pill from '../Pill';
import Icon from '../Icon';
import { search } from 'app/actions/SearchActions';
import { push } from 'react-router-redux';

const Keyboard = {
  ENTER: 13,
  UP: 38,
  DOWN: 40
};

const quickLinks = [
  ['', 'Interessegrupper'],
  ['', 'Butikk'],
  ['', 'Kontakt']
];

const SearchResultItem = ({ item, isSelected }) => (
  <li className={cx(
    isSelected && styles.isSelected
  )}
  >
    <Pill style={{ width: '150px', marginRight: '10px' }}>
      {item.type}
    </Pill>
    {item.title}
  </li>
);

type Props = {
  results: Array<any>;
  onCloseSearch: () => any;
  onQueryChanged: (value: string) => any;
  openSearchResult: () => any;
  searching: boolean;
};

type State = {
  selectedIndex: number;
};

class Search extends Component {
  props: Props;

  state: State = {
    selectedIndex: 0
  };

  handleKeyDown = (e) => {
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
            this.props.results.length - 1,
            this.state.selectedIndex + 1
          )
        });
        break;

      case Keyboard.ENTER:
        e.preventDefault();
        this.props.openSearchResult(
          this.props.results[this.state.selectedIndex]
        );
        break;
    }
  };

  render() {
    const { results, onCloseSearch, onQueryChanged, searching } = this.props;
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex={-1}>
        <div className={styles.overlay}>
          <div className={styles.inputContainer}>
            <div className={styles.searchIcon}>
              <Icon name='search' />
            </div>

            <input
              onChange={(e) => onQueryChanged(e.target.value)}
              type='search'
              placeholder='Hva leter du etter?'
              autoFocus
            />

            <button
              type='button'
              className={styles.closeButton}
              onClick={onCloseSearch}
            >
              <Icon name={searching ? 'spinner fa-spin' : 'close'} />
            </button>
          </div>

          <div className={styles.resultsContainer}>
            <ul className={styles.results}>
              {results.map((item, i) => (
                <SearchResultItem
                  key={i}
                  item={item}
                  isSelected={i === this.state.selectedIndex}
                />
              ))}
            </ul>

            <div className={styles.quickLinks}>
              <ul>
                {quickLinks.map(([href, name]) => (
                  <li key={name}>
                    <Link to={href}>{name}</Link>
                  </li>
                ))}
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
    results: state.search.results,
    searching: state.search.searching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onQueryChanged: debounce((query) => dispatch(search(query)), 500),
    openSearchResult: () => dispatch(push('/hello'))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
