import React, { Component, PropTypes } from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteTopNav from './QuoteTopNav';
import QuoteList from './QuoteList';

export default class QuotePage extends Component {

  state = {
    sortType: 'date'
  };

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired
  };

  setSortType = sortType => {
    this.setState({ sortType });
  };

  render() {
    return (
      <div className='u-container quote-container'>
        <div className='quotepage-left'>
          <QuoteTopNav
            routeParams={this.props.routeParams}
            sortType = {this.state.sortType}
            setSortType = {this.setSortType.bind(this)}
          />

          <QuoteList
            {...this.props}
            sortType = {this.state.sortType}
          />

        </div>

        <QuoteRightNav
          query={this.props.query}
        />

      </div>
    );
  }
}
