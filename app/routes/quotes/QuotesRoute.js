import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAllApproved,
  fetchAllUnapproved,
  approve,
  unapprove,
  deleteQuote
} from 'app/actions/QuoteActions';
import QuotePage from './components/QuotePage';
import { dispatched } from 'react-prepare';
import { selectSortedQuotes } from 'app/reducers/quotes';

const loadData = (props, dispatch) => {
  const { location: { query } } = props;

  if (query.filter === 'unapproved') {
    return dispatch(fetchAllUnapproved());
  }

  return dispatch(fetchAllApproved());
};

const mapStateToProps = (state, { location: { query } }) => ({
  quotes: selectSortedQuotes(state, { query }),
  query,
  actionGrant: state.quotes.actionGrant
});

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  approve,
  unapprove,
  deleteQuote
};

export default compose(
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
