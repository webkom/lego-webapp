import styles from './Quotes.css';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor, Button } from 'app/components/Form';

type Props = {
  addQuotes: Object => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  handleSubmit: () => void
};

const AddQuote = ({
  addQuotes,
  invalid,
  pristine,
  submitting,
  handleSubmit
}: Props) => {
  const disabledButton = invalid || pristine || submitting;

  return (
    <div className={styles.root}>
      <div className={styles.quoteTop}>
        <h1>Legg til sitat</h1>
      </div>

      <div className={styles.addQuote}>
        <form onSubmit={handleSubmit(addQuotes)}>
          <label htmlFor="addQuoteContent" style={{ fontSize: 30 }}>
            Selve sitatet <b>*</b>
          </label>

          <Field
            placeholder="Det gjør seg ikke sjæl"
            name="text"
            component={TextEditor.Field}
          />

          <label htmlFor="addQuoteSource" style={{ fontSize: 20 }}>
            Hvor sitatet kommer fra (sleng gjerne med noe snaks!) <b>*</b>
          </label>
          <Field
            placeholder="Harald Rex"
            name="source"
            component={TextEditor.Field}
            type="text"
          />

          <div className={styles.clear} />

          <Button
            type="submit"
            className={styles.submitQuote}
            disabled={disabledButton}
          >
            Send inn sitat
          </Button>
        </form>
      </div>
    </div>
  );
};

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
