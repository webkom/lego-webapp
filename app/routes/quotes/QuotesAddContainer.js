import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';
import { reduxForm } from 'redux-form';

function validateQuote(data) {
  const errors = {};
  if (!data.text) {
    errors.text = 'Vennligst fyll ut dette feltet';
  }

  if (!data.source) {
    errors.source = 'Vennligst fyll ut dette feltet';
  }
  return errors;
}

@reduxForm({
  form: 'addQuote',
  fields: ['text', 'source'],
  validate: validateQuote
})
@connect(
  null,
  { addQuotes }
)

export default class QuotesAddContainer extends Component {

  static propTypes = {
    addQuotes: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const { handleSubmit } = this.props;
    return <AddQuote {...this.props} addQuotes={handleSubmit(this.props.addQuotes)} />;
  }
}
