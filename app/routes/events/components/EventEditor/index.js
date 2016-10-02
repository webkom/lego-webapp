// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  TextInput,
  TextEditor,
  Button,
  DatePicker
} from 'app/components/Form';

function EventEditor({ handleSubmit }) {
  return (
    <div>
      <h2>Create an event</h2>
      <Form onSubmit={handleSubmit(() => {})}>
        <Field
          placeholder='Title'
          name='title'
          component={TextInput.Field}
          autoFocus
        />

        <Field
          placeholder='Description'
          name='description'
          component={TextEditor.Field}
        />

        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <Field
            name='startTime'
            component={DatePicker.Field}
            fieldStyle={{ flex: 1 }}
          />

          <Field
            name='endTime'
            component={DatePicker.Field}
            fieldStyle={{ flex: 1 }}
          />
        </div>

        <Field
          placeholder='Location'
          name='location'
          component={TextInput.Field}
          type='password'
        />

        <Button submit>Save Event</Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'eventEditor',
  validate(values) {
    const errors = {};
    if (!values.description) {
      errors.description = ['required', 'yolo'];
    }

    return errors;
  }
})(EventEditor);
