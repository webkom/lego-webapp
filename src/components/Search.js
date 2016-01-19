import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { Pill, Icon } from './ui';

const quickLinks = [
  ['', 'Interessegrupper'],
  ['', 'Butikk'],
  ['', 'Kontakt']
];

export default class Search extends Component {

  static propTypes = {
    results: PropTypes.array,
    onCloseSearch: PropTypes.func.isRequired,
    onQueryChanged: PropTypes.func.isRequired,
    searching: PropTypes.bool
  };

  state = {
    selectedIndex: 0
  };

  handleKeyDown(e) {
    switch (e.which) {
    case 38: // UP
      e.preventDefault();
      this.setState({ selectedIndex: Math.max(0, this.state.selectedIndex - 1) });
      break;

    case 40: // DOWN
      e.preventDefault();
      this.setState({
        selectedIndex: Math.min(this.props.results.length - 1, this.state.selectedIndex + 1)
      });
      break;
    case 13: // Enter
      e.preventDefault();
      // @todo: push some new history state here
      break;
    }
  }

  render() {
    const { results, onCloseSearch, onQueryChanged, searching } = this.props;
    return (
      <div onKeyDown={::this.handleKeyDown} className={cx('Search')} tabIndex={-1}>
        <div className='Search__overlay u-container'>
          <div className='Search__input'>
            <input
              onChange={e => onQueryChanged(e.target.value)}
              type='search'
              placeholder='Hva leter du etter?'
              autoFocus
            />

            <button type='button' className='Search__closeButton' onClick={onCloseSearch}>
              <Icon name='close' scaleOnHover />
            </button>
          </div>

          <div className='Search__results'>
            <ul className='Search__results__items'>
              {!searching && results.length === 0 && <li>No results</li>}
              {results.map((item, i) => (
                <li
                  className={cx(
                    'Search__results__items__item',
                    i === this.state.selectedIndex && 'is-selected'
                  )} key={i}
                >
                  <Pill style={{ width: '150px', marginRight: '10px' }}>{item.type}</Pill>
                  {item.title}
                </li>
              ))}
            </ul>

            <div className='Search__results__quickLinks'>
              <ul>
                {quickLinks.map(([href, name]) =>
                  <li key={name}>
                    <Link to={href}>{name}</Link>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
