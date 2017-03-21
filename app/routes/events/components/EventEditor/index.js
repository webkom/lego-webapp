// @flow

import React from 'react';
import {
  Form,
  Field,
  TextInput,
  Button,
  DatePicker,
  Select,
  createFormContainer
} from 'app/components/Form';
import { createEvent } from 'app/actions/EventActions';
import { createValidator, required } from 'app/utils/validation';

const validate = createValidator({
  title: [required()],
  description: [required()]
});

const EventTypes = [
  { label: 'Bedpress', value: 'company_presentation' },
  { label: 'Kurs', value: 'course' }
];

function EventEditor({ handleSubmit, isValid, fields, meta, saving }: any) {
  return (
    <div>
      <h2>Create an event</h2>
      <Form onSubmit={handleSubmit}>
        <Field component={TextInput} {...fields.title} autoFocus />
        <Field component={TextInput} {...fields.description} />

        <Field
          component={Select}
          {...fields.eventType}
          onChange={option =>
            fields.eventType.onChange({
              target: { name: fields.eventType.name, value: option.value }
            })}
          options={EventTypes}
        />

        <div
          style={{
            flexDirection: 'row',
            display: 'flex'
          }}
        >
          <Field component={DatePicker} {...fields.startTime} />
          <Field component={DatePicker} {...fields.endTime} />
        </div>

        <Field component={TextInput} {...fields.location} />

        <Button submit disabled={!isValid}>{saving ? '...' : 'Save'}</Button>
      </Form>
    </div>
  );
}

export default createFormContainer({
  validate,
  onSubmit: (state, props) =>
    props.dispatch(createEvent(state.values)).then(props.onClose),
  getInitialValues(props) {
    return {
      title: props.title || '',
      description: props.description || '',
      location: props.location || '',
      startTime: props.startTime || new Date(),
      endTime: props.endTime || new Date(),
      eventType: props.eventType || 'company_presentation'
    };
  }
})(EventEditor);
