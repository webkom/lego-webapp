import React, { Component, PropTypes } from 'react';
import SingleQuote from './SingleQuote';

const COMPARE_BY_DATE = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

const COMPARE_BY_LIKES = (a, b) => {
  return (b.likes - a.likes);
};

export default class QuoteList extends Component {

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    sortType: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  sortIt(myList, sortType) {
    if (sortType === 'date') {
      myList.sort(COMPARE_BY_DATE);
    } else {
      myList.sort(COMPARE_BY_LIKES);
    }
    return myList;
  }

  render() {
    return (
      <ul className='quotes'>
        {this.sortIt(this.props.quotes, this.props.sortType).map(quote =>
          <SingleQuote
            {...this.props}
            quote={quote}
            key={quote.id}
          />
        )}
      </ul>
    );
  }
}
