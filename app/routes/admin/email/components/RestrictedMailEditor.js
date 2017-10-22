//@flow

import React from 'react';
import Button from 'app/components/Button';
import config from 'app/config';
import { reduxForm } from 'redux-form';
import { isEmail, createValidator, required } from 'app/utils/validation';
import { TextInput, SelectInput } from 'app/components/Form';
import { Form, Field } from 'redux-form';

export type Props = {
  restrictedMailId?: number,
  submitting: boolean,
  handleSubmit: Function => void,
  push: string => void,
  mutateFunction: Object => Promise<*>
};

const RestrictedMailEditor = ({
  restrictedMailId,
  mutateFunction,
  submitting,
  push,
  handleSubmit
}: Props) => {
  const onSubmit = data => {
    mutateFunction({
      fromAddress: data.fromAddress,
      rawAddresses: (data.rawAddresses || []).map(
        rawAddresses => rawAddresses.value
      ),
      groups: (data.groups || []).map(group => group.id),
      events: (data.events || []).map(event => event.value),
      meetings: (data.meetings || []).map(meeting => meeting.id),
      users: (data.users || []).map(user => user.id)
    }).then(({ payload }) => {
      if (!restrictedMailId) {
        push(`/admin/email/restricted/${payload.result}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        disabled={restrictedMailId}
        required
        placeholder="Abakus@abakus.no"
        name="fromAddress"
        label="Eposten du ønsker å sende fra"
        component={TextInput.Field}
      />
      <Field
        disabled={restrictedMailId}
        label="Brukere"
        name="users"
        multi
        placeholder="Brukere du ønsker å sende epost til"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Grupper"
        name="groups"
        multi
        placeholder="Grupper du ønsker å sende epost til"
        filter={['users.abakusgroup']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Eventer"
        name="events"
        multi
        placeholder="Eventer du ønsker å sende epost til"
        filter={['events.event']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Møter"
        name="meetings"
        multi
        placeholder="Møter du ønsker å sende epost til"
        filter={['meetings.meeting']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Epost addresser"
        name="rawAddresses"
        placeholder="Enkelte eposter du ønsker å sende til"
        component={SelectInput.Field}
        multi
        tags
        isValidNewOption={({ label }: { label: string }) => isEmail()(label)[0]}
        shouldKeyDownEventCreateNewOption={({ keyCode }: { keyCode: number }) =>
          keyCode === 32 || keyCode === 13}
      />

      {!restrictedMailId && (
        <Button submit disabled={submitting}>
          Lag flaskepost
        </Button>
      )}
      {restrictedMailId && (
        <a
          href={`${config.serverUrl}/restricted-mail/${restrictedMailId}/token`}
          download
        >
          <Button>Last ned Epost token</Button>
        </a>
      )}
    </Form>
  );
};

export default reduxForm({
  form: 'restrictedEmail',
  enableReinitialize: true,
  validate: createValidator({
    fromAddress: [required(), isEmail()]
  })
})(RestrictedMailEditor);
