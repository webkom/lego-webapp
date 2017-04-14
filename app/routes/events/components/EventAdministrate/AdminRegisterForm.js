import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';

const AdminRegister = ({ handleSubmit, invalid, pristine, submitting }) => {
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
        <Field placeholder="Pool" name="pool" component={TextEditor.Field} />
        <Field placeholder="Bruker" name="user" component={TextEditor.Field} />
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
