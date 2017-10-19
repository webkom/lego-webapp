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
import { dispatched } from '@webkom/react-prepare';
import { selectSortedQuotes } from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectHasMore } from '../../reducers/selectors';

const mapStateToProps = (state, props) => ({
  quotes: selectSortedQuotes(state, props.location.query),
  query: props.location.query,
  actionGrant: state.quotes.actionGrant,
  hasMore: selectHasMore('quotes')(state)
});

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  approve,
  unapprove,
  deleteQuote,
  loadMore: approved =>
    approved ? fetchAllApproved(true) : fetchAllUnapproved(true)
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    (props, dispatch) => {
      const { location: { query } } = props;
      if (query.filter === 'unapproved') {
        return dispatch(fetchAllUnapproved(false));
      }
      return dispatch(fetchAllApproved(false));
    },
    { componentWillReceiveProps: false }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
