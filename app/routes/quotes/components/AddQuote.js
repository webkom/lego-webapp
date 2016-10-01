import styles from './Quotes.css';
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor } from 'app/components/Form';
import FieldWrapper from 'app/components/Form/FieldWrapper';

class AddQuote extends Component {

  static propTypes = {
    addQuotes: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      invalid,
      pristine,
      submitting,
      handleSubmit,
      addQuotes
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <div className={styles.root}>

        <div className={styles.quoteTop}>
          <h1>Legg til sitat</h1>
        </div>

        <div className={styles.addQuote}>
          <form onSubmit={handleSubmit(addQuotes)}>

            <label htmlFor='addQuoteContent' style={{ fontSize: 30 }}>
              Selve sitatet <b>*</b>
            </label>

            <Field
              placeholder='Skriv noe her...'
              className={styles.addQuoteContent}
              name='text'
              component={FieldWrapper}
              inputComponent={TextEditor}
              type='text'
            />
            <label htmlFor='addQuoteSource' style={{ fontSize: 20 }}>
              Hvor sitatet kommer fra (sleng gjerne med noe snaks!) <b>*</b>
            </label>
            <Field
              placeholder='Skriv noe her...'
              className={styles.addQuoteSource}
              name='source'
              component={FieldWrapper}
              inputComponent={TextEditor}
              type='text'
            />

            <div className={styles.clear}></div>
            <input type='submit' className={styles.submitQuote}
              value='Send inn' disabled = {disabledButton}
            />
          </form>
        </div>
      </div>
    );
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

export default reduxForm({
  form: 'addQuote',
  validate: validateQuote
})(AddQuote);
