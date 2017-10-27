// @flow

import styles from './Quotes.css';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor, Button } from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import { navigation } from '../utils';

type Props = {
  addQuotes: Object => Promise<*>,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  handleSubmit: ((Object) => Promise<*>) => void,
  actionGrant: Array<string>
};

const AddQuote = ({
  addQuotes,
  invalid,
  pristine,
  submitting,
  handleSubmit,
  actionGrant
}: Props) => {
  const disabledButton = invalid || pristine || submitting;

  return (
    <div className={styles.root}>
      {navigation('Legg til sitat', actionGrant)}

      <div className={styles.addQuote}>
        <form onSubmit={handleSubmit(addQuotes)}>
          <Field
            placeholder="Eks: Det er bare å gjøre det"
            label="Selve sitatet"
            name="text"
            component={TextEditor.Field}
          />

          <Field
            placeholder="Eks: Esso – alltid og i enhver situasjon"
            label="Hvor sitatet kommer fra (sleng gjerne med noe snaks!)"
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

const validate = createValidator({
  text: [required()],
  source: [required()]
});

export default reduxForm({
  form: 'addQuote',
  validate
})(AddQuote);
