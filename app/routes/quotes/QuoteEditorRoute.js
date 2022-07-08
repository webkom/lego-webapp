import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';

import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';

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
