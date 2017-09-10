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
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => ({
  quotes: selectSortedQuotes(state, props.location.query),
  query: props.location.query,
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
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    (props, dispatch) => {
      const { location: { query } } = props;
      if (query.filter === 'unapproved') {
        return dispatch(fetchAllUnapproved());
      }
      return dispatch(fetchAllApproved());
    },
    { componentWillReceiveProps: false }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
