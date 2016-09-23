import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

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

const mapDispatchToProps = { addQuotes };

export default compose(
  reduxForm({
    form: 'addQuote',
    fields: ['text', 'source'],
    validate: validateQuote
  }),
  connect(null, mapDispatchToProps)
)(QuotesAddContainer);
