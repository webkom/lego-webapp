import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuotePage from './components/QuotePage';

const compareByDate = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

const compareByLikes = (a, b) => b.likes - a.likes;

const sortQuotes = (quotes, sortType) => {
  const compare = sortType === 'date' ? compareByDate : compareByLikes;
  return quotes.sort(compare);
};

@connect((state, props) => ({
  quotes: sortQuotes(
            state.quotes.items.filter((item) => item.approved ===
              (state.router.location.query.filter !== 'unapproved')
            ),
            props.location.query.sort === 'likes' ? 'likes' : 'date'
  ),
  query: props.location.query
}),
  {
    fetchAllApproved,
    fetchAllUnapproved,
    fetchQuote,
    like,
    unlike,
    approve,
    unapprove,
    deleteQuote
  }
)
export default class QuotesContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    fetchAllApproved: PropTypes.func.isRequired,
    fetchAllUnapproved: PropTypes.func.isRequired,
    fetchQuote: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  loadData(props) {
    const filter = props.query.filter;

    if (filter === 'unapproved') {
      this.props.fetchAllUnapproved();
    } else {
      this.props.fetchAllApproved();
    }
  }

  componentWillMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query.filter !== nextProps.query.filter) {
      this.loadData(nextProps);
    }
  }

  render() {
    const sortType = this.props.query.sort === 'likes' ? 'likes' : 'date';
    return (
      <QuotePage
        {...this.props}
        sortType={sortType}
      />
    );
  }
}
