// @flow

import React from 'react';
import styles from './MeetingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import { Form, TextInput, TextEditor, Button, DatePicker } from 'app/components/Form';
import moment from 'moment';
import config from 'app/config';

type Props = {
  handleSubmit: func,
  handleSubmitCallback: func,
  meetingId?: string,
  meeting?: string
}

function MeetingEditor({ handleSubmit, handleSubmitCallback, meetingId, meeting }: Props) {
  const isEditPage = (meetingId !== undefined);
  if (isEditPage && meeting === undefined) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <h2>
        { isEditPage ? 'Endre møte' : 'Nytt møte' }
      </h2>
      <br />
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <h2> Tittel </h2>
        <Field
          name='title'
          component={TextInput.Field}
        />
        <Field
          name='id'
          readOnly
          hidden='true'
          component={TextInput.Field}
        />
        <h3>Møteinkalling / referat</h3>
        <Field
          name='report'
          rows='15'
          component={TextEditor.Field}
        />
        <h3>Start- og sluttidspunkt</h3>
        <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
          <Field
            name='startTime'
            component={DatePicker.Field}
            fieldStyle={{ flex: '0 0 49%' }}
          />
          <Field
            name='endTime'
            component={DatePicker.Field}
            fieldStyle={{ flex: '0 0 49%' }}
          />
        </div>

        <h3>Sted</h3>
        <Field
          name='location'
          component={TextInput.Field}
        />
        <h3>Referent (ID)</h3>
        <Field
          name='reportAuthor'
          type='number'
          placeholder='La denne stå åpen for å velge (semi)tilfeldig'
          component={TextInput.Field}
        />
        {// TODO Liste over allerede inviterte brukere når man endrer referat
        }
        <h3>Inviter brukere</h3>
        <span>(Bruk @navn eller @gruppe for å invitere)</span>
        <Field
          name='inviteUsers'
          component={TextInput.Field}
        />
        <Button submit>Save Event</Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'meetingEditor',
  validate(values) {
    const errors = {};
    if (!values.title) {
      errors.title = 'Kan ikke være tom';
    }
    if (!values.report) {
      errors.report = 'Kan ikke være tom';
    }
    if (!values.location) {
      errors.location = 'Kan ikke være tom';
    }
    if (!values.endTime) {
      errors.endTime = 'Kan ikke være tom';
    }
    if (!values.startTime) {
      errors.startTime = 'Kan ikke være tom';
    }
    const startTime = moment.tz(values.startTime, config.timezone);
    const endTime = moment.tz(values.endTime, config.timezone);
    if (startTime > endTime) {
      errors.endTime = 'Sluttidspunkt kan ikke være før starttidspunkt!';
    }
    return errors;
  }
})(MeetingEditor);
