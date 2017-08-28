// @flow

import React from 'react';
import styles from './MeetingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  TextInput,
  EditorField,
  SelectInput,
  Button,
  DatePicker
} from 'app/components/Form';
import moment from 'moment';
import config from 'app/config';

type Props = {
  handleSubmit: func,
  searching: boolean,
  autocompleteResult: Object,
  onUserQueryChanged: func,
  onGroupQueryChanged: func,
  handleSubmitCallback: func,
  meetingId?: string,
  meeting?: Object,
  change: func
};

function MeetingEditor({
  handleSubmit,
  searching,
  autocompleteResult,
  onUserQueryChanged,
  onGroupQueryChanged,
  handleSubmitCallback,
  meetingId,
  meeting,
  change
}: Props) {
  const isEditPage = meetingId !== undefined;
  if (isEditPage && !meeting) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={styles.root}>
      <h2>
        {isEditPage ? 'Endre møte' : 'Nytt møte'}
      </h2>
      <br />
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <h2> Tittel </h2>
        <Field name="title" component={TextInput.Field} />
        <h3>Møteinkalling / referat</h3>
        <div className={styles.editors}>
          <Field name="report" component={EditorField} />
        </div>
        <h3>Start- og sluttidspunkt</h3>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Field
            name="startTime"
            component={DatePicker.Field}
            fieldStyle={{ flex: '0 0 49%' }}
          />
          <Field
            name="endTime"
            component={DatePicker.Field}
            fieldStyle={{ flex: '0 0 49%' }}
          />
        </div>

        <h3>Sted</h3>
        <Field name="location" component={TextInput.Field} />
        <h3>Referent</h3>
        <Field
          name="reportAuthor"
          component={SelectInput.Field}
          options={autocompleteResult}
          onFocus={event => {}}
          placeholder="La denne stå åpen for å velge (semi)tilfeldig"
          onSearch={query => onUserQueryChanged(query)}
          multi
          simpleValue
          fetching={searching}
        />
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h3>Inviter brukere</h3>
            <Field
              name="users"
              component={SelectInput.Field}
              options={autocompleteResult}
              placeholder="Skriv inn brukernavn på de du vil invitere"
              onSearch={query => onUserQueryChanged(query)}
              multi
              fetching={searching}
            />
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h3>Inviter grupper</h3>
            <Field
              name="groups"
              component={SelectInput.Field}
              options={autocompleteResult}
              placeholder="Skriv inn brukernavn på de du vil invitere"
              onSearch={query => onGroupQueryChanged(query)}
              multi
              fetching={searching}
            />
          </div>
        </div>
        {isEditPage && <h3> Allerede inviterte </h3>}
        {isEditPage &&
          meeting.invitations.map(invite =>
            <span key={invite.id}>
              {invite.user.fullName}
            </span>
          )}
        <Button submit>
          {isEditPage ? 'Save event' : 'Create event'}{' '}
        </Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'meetingEditor',
  validate(values) {
    const errors = {};
    if (!values.title) {
      errors.title = 'Du må gi møtet en tittel';
    }
    if (!values.report) {
      errors.report = 'Referatet kan ikke være tomt';
    }
    if (!values.location) {
      errors.location = 'Du må velge en lokasjon for møtet';
    }
    if (!values.endTime) {
      errors.endTime = 'Du må velge starttidspunkt';
    }
    if (!values.startTime) {
      errors.startTime = 'Du må velge sluttidspunkt';
    }
    const startTime = moment.tz(values.startTime, config.timezone);
    const endTime = moment.tz(values.endTime, config.timezone);
    if (startTime > endTime) {
      errors.endTime = 'Sluttidspunkt kan ikke være før starttidspunkt!';
    }
    return errors;
  }
})(MeetingEditor);
