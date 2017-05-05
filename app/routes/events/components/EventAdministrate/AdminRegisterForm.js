import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, TextEditor, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';

const AdminRegister = ({
  pools,
  usersResult,
  onQueryChanged,
  searching,
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
        />
        <Field
          name="user"
          component={SelectInput.Field}
          options={usersResult}
          onSearch={query => onQueryChanged(query)}
          placeholder="Bruker"
          fetching={searching}
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
