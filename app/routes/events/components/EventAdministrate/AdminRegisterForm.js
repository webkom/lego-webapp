// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import type { EventPool } from 'app/models';
import type { ReduxFormProps } from 'app/types';

type Props = {
  pools: Array<EventPool>
} & ReduxFormProps;

const AdminRegister = ({
  pools,
  handleSubmit,
  invalid,
  pristine,
  submitting
}: Props) => {
  return (
    <div style={{ width: '400px' }}>
      <form onSubmit={handleSubmit}>
        <Field
          placeholder="Begrunnelse"
          label="Begrunnelse"
          name="reason"
          component={TextEditor.Field}
        />
        <Field
          placeholder="Tilbakemelding"
          label="Tilbakemelding"
          name="feedback"
          component={TextEditor.Field}
        />
        <Field
          name="pool"
          component={SelectInput.Field}
          placeholder="Pool"
          label="Pool"
          options={pools.map(pool => ({ value: pool.id, label: pool.name }))}
          simpleValue
        />
        <Field
          name="user"
          component={SelectInput.AutocompleteField}
          filter={['users.user']}
          placeholder="Bruker"
          label="Bruker"
        />
        <Button type="submit" disabled={invalid || pristine || submitting}>
          Registrer
        </Button>
      </form>
    </div>
  );
};

function validateForm(data) {
  const errors = {};

  if (!data.reason) {
    errors.reason = 'Forklaring er påkrevet';
  }

  if (!data.pool) {
    errors.pool = 'Pool er påkrevet';
  }

  if (!data.user) {
    errors.user = 'Bruker er påkrevet';
  }

  return errors;
}

export default reduxForm({
  form: 'adminRegister',
  validate: validateForm
})(AdminRegister);
