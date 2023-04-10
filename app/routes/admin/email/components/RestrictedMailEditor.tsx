import { reduxForm, Form, Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, SelectInput } from 'app/components/Form';
import CheckBox from 'app/components/Form/CheckBox';
import config from 'app/config';
import { isEmail, createValidator, required } from 'app/utils/validation';

export type Props = {
  restrictedMailId?: number;
  restrictedMail: Record<string, any>;
  submitting: boolean;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  push: (arg0: string) => void;
  mutateFunction: (arg0: Record<string, any>) => Promise<any>;
};
const hiddenSenderLabel = (
  <div>
    <p
      style={{
        marginBottom: '0',
      }}
    >
      Vil du skjule original avsender?
    </p>
    <p
      style={{
        fontStyle: 'italic',
        fontSize: '16px',
      }}
    >
      - Dette gjør at adressen i feltet over ikke vises som opprinnelig avsender
      nederst i eposten
    </p>
  </div>
);
const restrictedMailLabel = (
  <div>
    <p
      style={{
        marginBottom: '0',
      }}
    >
      Skal denne brukes til ukesmail?
    </p>
    <p
      style={{
        fontStyle: 'italic',
        fontSize: '16px',
      }}
    >
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
        isMulti
        placeholder="Brukere du ønsker å sende epost til"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Grupper"
        name="groups"
        isMulti
        placeholder="Grupper du ønsker å sende epost til"
        filter={['users.abakusgroup']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Arrangementer"
        name="events"
        isMulti
        placeholder="Arrangementer du ønsker å sende epost til"
        filter={['events.event']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Møter"
        name="meetings"
        isMulti
        placeholder="Møter du ønsker å sende epost til"
        filter={['meetings.meeting']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        disabled={restrictedMailId}
        label="Epost addresser"
        name="rawAddresses"
        placeholder="Enkelte e-poster du ønsker å sende til"
        component={SelectInput.Field}
        tags
        isMulti
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
          <Button>Last ned e-post token</Button>
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
