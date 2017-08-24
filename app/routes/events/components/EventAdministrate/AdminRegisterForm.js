import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import AutocompleteField from 'app/components/Search/AutocompleteField';

const AdminRegister = ({
  pools,
  handleSubmit,
  invalid,
  pristine,
  submitting
}) => {
  return (
    <div style={{ width: '400px' }}>
      <form onSubmit={handleSubmit}>
        <Field
          placeholder="Begrunnelse"
          name="reason"
          component={TextEditor.Field}
        />
        <Field
          placeholder="Tilbakemelding"
          name="feedback"
          component={TextEditor.Field}
        />
        <Field
          name="pool"
          component={SelectInput.Field}
          placeholder="Pool"
          options={pools.map(pool => ({ value: pool.id, label: pool.name }))}
          simpleValue
        />
        <AutocompleteField
          name="user"
          component={SelectInput.Field}
          filter={['users.user']}
          placeholder="Bruker"
          simpleValue
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
