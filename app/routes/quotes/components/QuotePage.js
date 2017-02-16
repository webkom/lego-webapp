import React, { Component, PropTypes } from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteTopNav from './QuoteTopNav';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import cx from 'classnames';

type Props = {
  params: Object,
  fetchAllApproved: () => void,
  fetchAllUnapproved: () => void,
  fetchQuote: () => void,
  query: Object,
  location: Object
};

export default class QuotePage extends Component {
  props: Props;

  render() {
    const { sortType } = this.props;
    const empty = this.props.quotes.length === 0 ? 'Ingen sitater.' : '';
    return (
      <div className={cx(styles.root, styles.quoteContainer)}>
        <div className={styles.quotepageLeft}>
          <QuoteTopNav {...this.props} sortType={sortType} />

          {empty}

          <QuoteList {...this.props} sortType={sortType} />

        </div>

        <QuoteRightNav query={this.props.query} />
      </div>
    );
  }
}
