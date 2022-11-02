import { compose } from 'redux';
import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('addQuote');
  return {
    actionGrant: state.quotes.actionGrant,
    text: valueSelector(state, 'text'),
    source: valueSelector(state, 'source'),
  };
};

const mapDispatchToProps = { addQuotes };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(AddQuote);
