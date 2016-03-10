import React, { Component, PropTypes } from 'react';

export default class QuoteTopNav extends Component {

  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    setSortType: PropTypes.func.isRequired,
    sortType: PropTypes.string.isRequired
  };

  setSortType(sortType) {
    this.props.setSortType(sortType);
  }

  render() {
    return (
      <div>
        <div className='quote-top'>
          <h1>Sitater!</h1>
          {(this.props.routeParams.filter === undefined ||
            this.props.routeParams.filter === 'unapproved') && (
          <div className='sort-quote'>
            Sorter etter:
            <a
              onClick={() => this.setSortType('date')}
              className = {(this.props.sortType === 'date') ?
                'selected-quote-sort' : 'unselected-quote-sort'}
            >Dato</a>
            <a
              onClick={() => this.props.setSortType('likes')}
              className = {(this.props.sortType === 'likes') ?
              'selected-quote-sort' : 'unselected-quote-sort'}
            >Likes</a>
          </div>
          )}
        </div>
        <div className='clear'></div>
      </div>
    );
  }
}
