import { Icon, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Download } from 'lucide-react';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import { ContentMain } from '~/components/Content';
import { TextInput, Form, SelectInput, LegoFinalForm } from '~/components/Form';
import CheckBox from '~/components/Form/CheckBox';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import {
  createRestrictedMail,
  fetchRestrictedMail,
} from '~/redux/actions/RestrictedMailActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectRestrictedMailById } from '~/redux/slices/restrictedMails';
import { appConfig } from '~/utils/appConfig';
import { useParams } from '~/utils/useParams';
import { isEmail, createValidator, required } from '~/utils/validation';
import type { DetailedRestrictedMail } from '~/redux/models/RestrictedMail';

const validate = createValidator({
  fromAddress: [required(), isEmail()],
});

const RestrictedMailEditor = () => {
  const { restrictedMailId } = useParams<{ restrictedMailId: string }>();
  const isNew = restrictedMailId === undefined;
  const restrictedMail = useAppSelector<DetailedRestrictedMail | undefined>(
    (state) => selectRestrictedMailById(state, restrictedMailId),
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
          label: meeting.title,
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
          }),
        ),
        users: (restrictedMail?.users || []).map((user) => ({
          label: user.fullName,
          value: user.id,
        })),
      };

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRestrictedMail',
    () => restrictedMailId && dispatch(fetchRestrictedMail(restrictedMailId)),
    [restrictedMailId],
  );

  const onSubmit = (data) => {
    const payload = {
      ...data,
      rawAddresses: (data.rawAddresses || []).map(
        (rawAddresses) => rawAddresses.value,
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
    <ContentMain>
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
              label="Vil du skjule original avsender?"
              description="Dette gjør at adressen i feltet over ikke vises som opprinnelig avsender nederst i e-posten"
              type="checkbox"
              component={CheckBox.Field}
            />
            <Field
              disabled={!isNew}
              name="weekly"
              label="Skal denne brukes til ukesmail?"
              description="Dette legger til alle aktive studenter som mottakere"
              type="checkbox"
              component={CheckBox.Field}
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
              label="Skibidi events😛💯🚽"
              name="events"
              isMulti
              placeholder="Skibidi events😛💯🚽 du ønsker å sende e-post til"
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

            {isNew && <SubmitButton>Opprett flaskepost</SubmitButton>}
            {!isNew && restrictedMailId && restrictedMail && (
              <LinkButton
                href={`${appConfig.serverUrl}/restricted-mail/${restrictedMailId}/token?auth=${restrictedMail.tokenQueryParam}`}
                download
              >
                <Icon iconNode={<Download />} size={19} />
                Last ned e-post token
              </LinkButton>
            )}
          </Form>
        )}
      </LegoFinalForm>
    </ContentMain>
  );
};

export default RestrictedMailEditor;
