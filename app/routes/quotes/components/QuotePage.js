import React, { Component, PropTypes } from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteTopNav from './QuoteTopNav';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import cx from 'classnames';

export default class QuotePage extends Component {

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    routeParams: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    sortType: PropTypes.string.isRequired
  };

  render() {
    const { sortType } = this.props;
    const empty = this.props.quotes.length === 0 ? 'Ingen sitater.' : '';
    return (
      <div className={cx(styles.root, styles.quoteContainer)}>
        <div className={styles.quotepageLeft}>
          <QuoteTopNav
            {...this.props}
            sortType={sortType}
          />

          {empty}

          <QuoteList
            {...this.props}
            sortType={sortType}
          />

        </div>

        <QuoteRightNav
          query={this.props.query}
        />
      </div>

    );
  }
}
