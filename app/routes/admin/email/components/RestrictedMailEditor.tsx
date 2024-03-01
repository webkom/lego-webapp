import { Button, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createRestrictedMail,
  fetchRestrictedMail,
} from 'app/actions/RestrictedMailActions';
import {
  TextInput,
  Form,
  SelectInput,
  LegoFinalForm,
} from 'app/components/Form';
import CheckBox from 'app/components/Form/CheckBox';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import config from 'app/config';
import { selectRestrictedMailById } from 'app/reducers/restrictedMails';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { isEmail, createValidator, required } from 'app/utils/validation';

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
      nederst i e-posten
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

const validate = createValidator({
  fromAddress: [required(), isEmail()],
});

const RestrictedMailEditor = () => {
  const { restrictedMailId } = useParams<{ restrictedMailId: string }>();
  const isNew = restrictedMailId === undefined;
  const restrictedMail = useAppSelector((state) =>
    selectRestrictedMailById(state, restrictedMailId!)
  );

  const initialValues = isNew
    ? {}
    : {
        ...restrictedMail,
        groups: (restrictedMail?.groups || []).map((groups) => ({
          label: groups.name,
          value: groups.id,
        })),
        meetings: (restrictedMail?.meetings || []).map((meeting) => ({
          label: meeting.name,
          value: meeting.id,
        })),
        events: (restrictedMail?.events || []).map((event) => ({
          label: event.title,
          value: event.id,
        })),
        // Raw Sauce
        rawAddresses: (restrictedMail?.rawAddresses || []).map(
          (rawAddresses) => ({
            label: rawAddresses,
            value: rawAddresses,
          })
        ),
        users: (restrictedMail?.users || []).map((user) => ({
          label: user.fullName,
          value: user.id,
        })),
      };

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRestrictedMail',
    () =>
      !isNew &&
      restrictedMailId &&
      dispatch(fetchRestrictedMail(restrictedMailId)),
    [restrictedMailId]
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const payload = {
      ...data,
      rawAddresses: (data.rawAddresses || []).map(
        (rawAddresses) => rawAddresses.value
      ),
      groups: (data.groups || []).map((group) => group.id),
      events: (data.events || []).map((event) => event.value),
      meetings: (data.meetings || []).map((meeting) => meeting.id),
      users: (data.users || []).map((user) => user.id),
    };

    if (isNew) {
      dispatch(createRestrictedMail(payload)).then((res) => {
        navigate(`/admin/email/restricted/${res.payload.result}`);
      });
    }
  };

  return (
    <LegoFinalForm
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            disabled={!isNew}
            required
            placeholder="abakus@abakus.no"
            name="fromAddress"
            label="E-posten du ønsker å sende fra"
            component={TextInput.Field}
          />
          <Field
            disabled={!isNew}
            name="hideSender"
            label={hiddenSenderLabel}
            type="checkbox"
            component={CheckBox.Field}
            parse={(v) => !!v}
          />
          <Field
            disabled={!isNew}
            name="weekly"
            label={restrictedMailLabel}
            type="checkbox"
            component={CheckBox.Field}
            parse={(v) => !!v}
          />

          <Field
            disabled={!isNew}
            label="Brukere"
            name="users"
            isMulti
            placeholder="Brukere du ønsker å sende e-post til"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={!isNew}
            label="Grupper"
            name="groups"
            isMulti
            placeholder="Grupper du ønsker å sende e-post til"
            filter={['users.abakusgroup']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={!isNew}
            label="Arrangementer"
            name="events"
            isMulti
            placeholder="Arrangementer du ønsker å sende e-post til"
            filter={['events.event']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={!isNew}
            label="Møter"
            name="meetings"
            isMulti
            placeholder="Møter du ønsker å sende e-post til"
            filter={['meetings.meeting']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={!isNew}
            label="E-postadresser"
            name="rawAddresses"
            placeholder="Enkelte e-poster du ønsker å sende til"
            component={SelectInput.Field}
            tags
            isMulti
            isValidNewOption={({ label }: { label: string }) =>
              isEmail()(label)[0]
            }
            shouldKeyDownEventCreateNewOption={({
              keyCode,
            }: {
              keyCode: number;
            }) => keyCode === 32 || keyCode === 13}
          />

          <SubmissionError />
          {isNew && <SubmitButton>Lag flaskepost</SubmitButton>}
          {!isNew && restrictedMailId && restrictedMail && (
            <a
              href={`${config.serverUrl}/restricted-mail/${restrictedMailId}/token?auth=${restrictedMail.tokenQueryParam}`}
              download
            >
              <Button>
                <Icon name="download-outline" size={19} />
                Last ned e-post token
              </Button>
            </a>
          )}
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default RestrictedMailEditor;
