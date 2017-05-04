import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './Quotes.css';

export default class QuoteTopNav extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    sortType: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.quoteTop}>
          <h1>Sitater!</h1>
          <div className={styles.sortQuote}>
            Sorter etter:

            <Link
              to={
                this.props.query.filter === 'unapproved'
                  ? '/quotes?filter=unapproved'
                  : '/quotes'
              }
              className={
                this.props.sortType === 'date'
                  ? 'selectedQuoteSort'
                  : 'unselectedQuoteSort'
              }
            >
              Dato
            </Link>

            <Link
              to={
                this.props.query.filter === 'unapproved'
                  ? '/quotes?filter=unapproved&sort=likes'
                  : '/quotes?sort=likes'
              }
              className={
                this.props.sortType === 'likes'
                  ? 'selectedQuoteSort'
                  : 'unselectedQuoteSort'
              }
            >
              Likes
            </Link>

          </div>
        </div>
        <div className={styles.clear} />
      </div>
    );
  }
}
