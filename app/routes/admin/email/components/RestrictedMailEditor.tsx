import { Button, Icon } from '@webkom/lego-bricks';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';
import { push } from 'redux-first-history';
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
  const { restrictedMailId } = useParams();
  const restrictedMail = useAppSelector((state) =>
    selectRestrictedMailById(state, { restrictedMailId })
  );

  const initialValues = {
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
    rawAddresses: (restrictedMail?.rawAddresses || []).map((rawAddresses) => ({
      label: rawAddresses,
      value: rawAddresses,
    })),
    users: (restrictedMail?.users || []).map((user) => ({
      label: user.fullName,
      value: user.id,
    })),
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (restrictedMailId) {
      dispatch(fetchRestrictedMail(restrictedMailId));
    }
  }, [dispatch, restrictedMailId]);

  const onSubmit = async (data) => {
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

    if (!restrictedMailId) {
      const response = await dispatch(createRestrictedMail(payload));
      dispatch(push(`/admin/email/restricted/${response.payload.result}`));
    }
  };

  return (
    <LegoFinalForm
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit, submitting, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            disabled={restrictedMailId}
            required
            placeholder="abakus@abakus.no"
            name="fromAddress"
            label="E-posten du ønsker å sende fra"
            component={TextInput.Field}
          />
          <Field
            disabled={restrictedMailId}
            name="hideSender"
            label={hiddenSenderLabel}
            component={CheckBox.Field}
            parse={(v) => !!v}
          />
          <Field
            disabled={restrictedMailId}
            name="weekly"
            label={restrictedMailLabel}
            component={CheckBox.Field}
            parse={(v) => !!v}
          />

          <Field
            disabled={restrictedMailId}
            label="Brukere"
            name="users"
            isMulti
            placeholder="Brukere du ønsker å sende e-post til"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={restrictedMailId}
            label="Grupper"
            name="groups"
            isMulti
            placeholder="Grupper du ønsker å sende e-post til"
            filter={['users.abakusgroup']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={restrictedMailId}
            label="Arrangementer"
            name="events"
            isMulti
            placeholder="Arrangementer du ønsker å sende e-post til"
            filter={['events.event']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={restrictedMailId}
            label="Møter"
            name="meetings"
            isMulti
            placeholder="Møter du ønsker å sende e-post til"
            filter={['meetings.meeting']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            disabled={restrictedMailId}
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

          {!restrictedMailId && (
            <Button submit disabled={submitting || pristine}>
              Lag flaskepost
            </Button>
          )}
          {restrictedMailId && restrictedMail && (
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
