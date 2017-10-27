// @flow

import React from 'react';

import { Link } from 'react-router';
import styles from './MeetingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { AttendanceStatus } from 'app/components/UserAttendance';

import {
  Form,
  TextInput,
  EditorField,
  SelectInput,
  Button,
  DatePicker
} from 'app/components/Form';
import moment from 'moment-timezone';
import config from 'app/config';
import { unionBy } from 'lodash';
import type { UserEntity } from 'app/reducers/users';

type Props = {
  handleSubmit: Object => void,
  handleSubmitCallback: Object => Promise<*>,
  meetingId?: string,
  meeting: Object,
  change: () => void,
  // $FlowFixMe
  invitingUsers: Array<UserEntity>,
  user: UserEntity,
  pristine: boolean,
  submitting: boolean,
  meetingInvitations: Array<Object>,
  push: string => void,
  inviteUsersAndGroups: Object => Promise<*>
};

function MeetingEditor({
  handleSubmit,
  handleSubmitCallback,
  meetingId,
  meeting,
  change,
  invitingUsers = [],
  user,
  submitting,
  pristine,
  meetingInvitations,
  push,
  inviteUsersAndGroups
}: Props) {
  const onSubmit = data => {
    return handleSubmitCallback(data)
      .then(result => {
        const id = data.id || result.payload.result;
        const { groups, users } = data;
        if (groups || users) {
          return inviteUsersAndGroups({ id, users, groups }).then(() =>
            push(`/meetings/${id}`)
          );
        }
        push(`/meetings/${id}`);
      })
      .catch(err => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };
  const isEditPage = meetingId !== undefined;
  if (isEditPage && !meeting) {
    return <LoadingIndicator loading />;
  }

  const userSearchable = {
    value: user.username,
    label: user.fullName,
    id: user.id
  };

  const invitedUsersSearchable = meetingInvitations
    ? meetingInvitations.map(invite => ({
        value: invite.user.username,
        label: invite.user.fullName,
        id: invite.user.id
      }))
    : [];

  // $FlowFixMe
  const possibleReportAuthors = unionBy(
    [userSearchable],
    invitedUsersSearchable,
    invitingUsers,
    'value'
  );

  return (
    <div className={styles.root}>
      <h2>
        <Link to={isEditPage ? `/meetings/${meeting.id}` : `/meetings/`}>
          <i className="fa fa-angle-left" />
          {isEditPage ? ` ${meeting.title}` : ' Mine møter'}
        </Link>
      </h2>
      <h1>{isEditPage ? 'Endre møte' : 'Nytt møte'} </h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          label="Tittel"
          placeholder="Ny tittel for møte"
          component={TextInput.Field}
        />
        <h3>Møtereferat</h3>
        <Field name="report" label="Referat" component={EditorField} />
        <div className={styles.sideBySideBoxes}>
          <div>
            <Field
              name="startTime"
              label="Starttidspunkt"
              component={DatePicker.Field}
            />
          </div>
          <div>
            <Field
              name="endTime"
              label="Sluttidspunkt"
              component={DatePicker.Field}
            />
          </div>
        </div>

        <Field
          name="location"
          label="Sted"
          placeholder="Sted for møte"
          component={TextInput.Field}
        />
        <Field
          name="reportAuthor"
          label="Referent"
          placeholder="La denne stå åpen for å velge deg selv"
          options={possibleReportAuthors}
          component={SelectInput.Field}
        />
        <div className={styles.sideBySideBoxes}>
          <div>
            <Field
              name="users"
              filter={['users.user']}
              label="Invitere brukere"
              placeholder="Skriv inn brukernavn på de du vil invitere"
              component={SelectInput.AutocompleteField}
              multi
            />
          </div>
          <div>
            <Field
              name="groups"
              filter={['users.abakusgroup']}
              label="Invitere grupper"
              placeholder="Skriv inn gruppene du vil invitere"
              component={SelectInput.AutocompleteField}
              multi
            />
          </div>
        </div>
        {isEditPage && <h3> Allerede inviterte </h3>}
        {isEditPage && (
          <div>
            <AttendanceStatus.Modal
              pools={[
                {
                  name: 'Inviterte brukere',
                  registrations: meetingInvitations
                }
              ]}
            />
            <br />
          </div>
        )}

        <Button disabled={pristine || submitting} submit>
          {isEditPage ? 'Lagre møte' : 'Lag møte'}
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
