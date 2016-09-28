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

export class QuotesRoute extends Component {

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
    return (
      <QuotePage
        {...this.props}
      />
    );
  }
}

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

function mapStateToProps(state, props) {
  const { query } = props.location;
  const quotes = state.quotes.items
    .map((id) => state.entities.quotes[id])
    .filter((quote) => quote.approved === (query.filter !== 'unapproved'));

  const sortType = query.sort === 'likes' ? 'likes' : 'date';
  return {
    quotes: sortQuotes(quotes, sortType),
    query,
    sortType
  };
}

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(QuotesRoute);
