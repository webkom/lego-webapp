import React, { Component, PropTypes } from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteTopNav from './QuoteTopNav';
import QuoteList from './QuoteList';

export default class QuotePage extends Component {

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    routeParams: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    sortType: PropTypes.string.isRequired
  };

  render() {
    const { sortType } = this.props;
    return (
      <div className='u-container quote-container'>
        <div className='quotepage-left'>

          <QuoteTopNav
            {...this.props}
            sortType={sortType}
          />

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
