// @flow

import styles from './Search.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cx from 'classnames';
import { debounce } from 'lodash';
import Pill from '../Pill';
import Icon from '../Icon';
import { autocomplete } from 'app/actions/SearchActions';
import { push } from 'react-router-redux';

const Keyboard = {
  ENTER: 13,
  UP: 38,
  DOWN: 40
};

export const searchMap = {
  'users.user': {
    icon: 'user',
    title: (item) => item.payload.full_name,
    color: '#A1C34A',
    link: '/users/'
  },
  'articles.article': {
    icon: 'newspaper-o',
    title: (item) => item.text,
    color: '#52B0EC',
    link: '/articles/'
  },
  'events.event': {
    icon: 'calendar',
    title: (item) => item.text,
    color: '#E8953A',
    link: '/events/'
  }
};

const quickLinks = [
  ['', 'Interessegrupper'],
  ['', 'Butikk'],
  ['', 'Kontakt']
];

const SearchResultItem = ({ item, isSelected }) => {
  const objectType = searchMap[item.content_type];
  return (
    <Link to={objectType.link + item.object_id}>
      <li className={cx(isSelected && styles.isSelected)} Style={{ borderColor: objectType.color }}>
        <Icon className={styles.searchResultItemIcon} name={objectType.icon} />
        {objectType.title(item)}
      </li>
    </Link>
  );
};

type Props = {
  results: Array<any>;
  onCloseSearch: () => any;
  onQueryChanged: (value: string) => any;
  openSearchRoute: (query: string) => any;
  searching: boolean;
};

type State = {
  query: string;
  selectedIndex: number;
};

class Search extends Component {
  props: Props;

  state: State = {
    query: '',
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
          const item = this.props.results[this.state.selectedIndex - 1];
          const objectType = searchMap[item.content_type];
          this.props.push(objectType.link + item.object_id);
        }
        this.props.onCloseSearch();
        break;

      default:
        return;
    }
  };

  onQueryChanged = (query) => {
    this.setState({ query });
    this.props.onQueryChanged(query);
  }

  render() {
    const { results, onCloseSearch, searching } = this.props;
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex={-1}>
        <div className={styles.overlay}>
          <div className={styles.inputContainer}>
            <div className={styles.searchIcon}>
              <Icon name='search' />
            </div>

            <input
              onChange={(e) => this.onQueryChanged(e.target.value)}
              value={this.state.query}
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
                  isSelected={i === this.state.selectedIndex - 1}
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
    results: state.autocomplete.results,
    searching: state.autocomplete.searching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onQueryChanged: debounce((query) => dispatch(autocomplete(query)), 300),
    openSearchRoute: (query) => dispatch(push(`/search?q=${query}`)),
    push: (uri) => dispatch(push(uri))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
