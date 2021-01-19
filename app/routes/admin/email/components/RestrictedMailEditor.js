//@flow

import Button from 'app/components/Button';
import config from 'app/config';
import { reduxForm, Form, Field } from 'redux-form';
import { isEmail, createValidator, required } from 'app/utils/validation';
import { TextInput, SelectInput } from 'app/components/Form';

import CheckBox from 'app/components/Form/CheckBox';

export type Props = {
  restrictedMailId?: number,
  restrictedMail: Object,
  submitting: boolean,
  handleSubmit: (Function) => void,
  push: (string) => void,
  mutateFunction: (Object) => Promise<*>,
};

const hiddenSenderLabel = (
  <div>
    <p style={{ marginBottom: '0' }}>Vil du skjule original avsender?</p>
    <p style={{ fontStyle: 'italic', fontSize: '16px' }}>
      - Dette gjør at adressen i feltet over ikke vises som opprinnelig avsender
      nederst i eposten
    </p>
  </div>
);

const restrictedMailLabel = (
  <div>
    <p style={{ marginBottom: '0' }}>Skal denne brukes til ukesmail?</p>
    <p style={{ fontStyle: 'italic', fontSize: '16px' }}>
      - Dette legger til alle aktive studenter som mottakere
    </p>
  </div>
);

const RestrictedMailEditor = ({
  restrictedMail,
  restrictedMailId,
  mutateFunction,
  submitting,
  push,
  handleSubmit,
}: Props) => {
  const onSubmit = (data) => {
    mutateFunction({
      ...data,
      rawAddresses: (data.rawAddresses || []).map(
        (rawAddresses) => rawAddresses.value
      ),
      groups: (data.groups || []).map((group) => group.id),
      events: (data.events || []).map((event) => event.value),
      meetings: (data.meetings || []).map((meeting) => meeting.id),
      users: (data.users || []).map((user) => user.id),
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
        placeholder="abakus@abakus.no"
        name="fromAddress"
        label="Eposten du ønsker å sende fra"
        component={TextInput.Field}
      />
      <Field
        disabled={restrictedMailId}
        name="hideSender"
        label={hiddenSenderLabel}
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
      <Field
        disabled={restrictedMailId}
        name="weekly"
        label={restrictedMailLabel}
        component={CheckBox.Field}
        normalize={(v) => !!v}
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
        label="Arrangementer"
        name="events"
        multi
        placeholder="Arrangementer du ønsker å sende epost til"
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
        tags
        multi
        isValidNewOption={({ label }: { label: string }) => isEmail()(label)[0]}
        shouldKeyDownEventCreateNewOption={({ keyCode }: { keyCode: number }) =>
          keyCode === 32 || keyCode === 13
        }
      />

      {!restrictedMailId && (
        <Button submit disabled={submitting}>
          Lag flaskepost
        </Button>
      )}
      {restrictedMailId && restrictedMail && (
        <a
          href={`${config.serverUrl}/restricted-mail/${restrictedMailId}/token?auth=${restrictedMail.tokenQueryParam}`}
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
    fromAddress: [required(), isEmail()],
  }),
})(RestrictedMailEditor);
