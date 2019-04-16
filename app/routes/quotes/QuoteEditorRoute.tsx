import { compose } from 'redux';
import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  return {
    actionGrant: state.quotes.actionGrant
  };
};

const mapDispatchToProps = { addQuotes };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddQuote);
