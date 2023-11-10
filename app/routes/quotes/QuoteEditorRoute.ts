import { connect } from 'react-redux';
import { compose } from 'redux';
import { addQuotes } from 'app/actions/QuoteActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import AddQuote from './components/AddQuote';

const mapStateToProps = (state) => {
  return {
    actionGrant: state.quotes.actionGrant,
  };
};

const mapDispatchToProps = {
  addQuotes,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
)(AddQuote);
