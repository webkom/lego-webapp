import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchEmojis } from 'app/actions/EmojiActions';
import { fetchAll, deleteQuote } from 'app/actions/QuoteActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEmojis } from 'app/reducers/emojis';
import { selectQuotes } from 'app/reducers/quotes';
import { selectPaginationNext } from 'app/reducers/selectors';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import QuotePage from './components/QuotePage';

const mapStateToProps = (state, props) => {
  return {
    query: pagination.query,
  };
};

const mapDispatchToProps = {};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
