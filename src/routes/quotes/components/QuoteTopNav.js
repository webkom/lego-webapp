import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class QuoteTopNav extends Component {

  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    sortType: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <div className='quote-top'>
          <h1>Sitater!</h1>
          <div className='sort-quote'>
            Sorter etter:

            <Link
              to={this.props.query.filter === 'unapproved' ?
              '/quotes?filter=unapproved' : '/quotes'}
              className = {(this.props.sortType === 'date') ?
                'selected-quote-sort' : 'unselected-quote-sort'}
            >Dato</Link>

            <Link
              to={this.props.query.filter === 'unapproved' ?
              '/quotes?filter=unapproved&sort=likes' : '/quotes?sort=likes'}
              className = {(this.props.sortType === 'likes') ?
              'selected-quote-sort' : 'unselected-quote-sort'}
            >Likes</Link>

          </div>
        </div>
        <div className='clear'></div>
      </div>
    );
  }
}
