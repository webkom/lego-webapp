import styles from './Quotes.css';
import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { TextField } from 'app/components/Form';
import FieldWrapper from 'app/components/Form/FieldWrapper';

export default class AddQuote extends Component {

  static propTypes = {
    addQuotes: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <div className={styles.root}>

        <div className={styles.quoteTop}>
          <h1>Legg til sitat</h1>
        </div>

        <div className={styles.addQuote}>
          <form onSubmit={this.props.addQuotes}>

            <label htmlFor='addQuoteContent' style={{ fontSize: 30 }}>
              Selve sitatet <b>*</b>
            </label>

            <Field
              placeholder='Skriv noe her...'
              className={styles.addQuoteContent}
              name='text'
              component={FieldWrapper}
              inputComponent={TextField}
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
              inputComponent={TextField}
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
