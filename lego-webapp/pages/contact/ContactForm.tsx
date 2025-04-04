import { Card, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import { Field } from 'react-final-form';
import { GroupType } from 'app/models';
import {
  Form,
  TextInput,
  TextArea,
  CheckBox,
  Captcha,
  SelectInput,
  LegoFinalForm,
} from '~/components/Form';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { sendContactMessage } from '~/redux/actions/ContactActions';
import { fetchAllWithType, fetchGroup } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectGroupById, selectGroupsByType } from '~/redux/slices/groups';
import { isNotNullish } from '~/utils';
import { createValidator, maxLength, required } from '~/utils/validation';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});

const REVUE_BOARD_GROUP_ID = 59;

const ContactForm = () => {
  const loggedIn = useIsLoggedIn();

  const committees = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Committee),
  );
  const revueBoard = useAppSelector((state) =>
    selectGroupById(state, REVUE_BOARD_GROUP_ID),
  );
  const groups = [...committees, revueBoard].filter(isNotNullish);
  const fetching = useAppSelector((state) => state.groups.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGroups',
    () =>
      Promise.allSettled([
        dispatch(fetchAllWithType(GroupType.Committee)),
        // The revue board group does not exist in the local dev environment.
        // It should be added to the fixtures, so that the propagateError flag can be removed.
        dispatch(fetchGroup(REVUE_BOARD_GROUP_ID, { propagateError: false })),
      ]),
    [],
  );

  if (isEmpty(groups) || fetching) {
    return <LoadingIndicator loading={fetching} />;
  }

  const onSubmit = (data, form) => {
    dispatch(
      sendContactMessage({
        ...data,
        recipient_group: data.recipient_group.value,
      }),
    ).then(() => {
      form.reset();
    });
  };

  const hsRecipient = {
    value: null,
    label: 'Hovedstyret',
  };
  const recipientOptions = groups.map((g) => ({
    value: g.id,
    label: g.name,
  }));

  return (
    <LegoFinalForm
      onSubmit={onSubmit}
      validate={validate}
      validateOnSubmitOnly
      initialValues={{
        anonymous: !loggedIn,
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <p>
            Dette skjemaet er et verktøy for å nå ut til Abakus sine komiteer
            eller Hovedstyret, enten du har spørsmål, tilbakemeldinger, eller
            bare ønsker å dele informasjon med oss.
          </p>
          <Card severity="info">
            <span>
              Dersom du ønsker å varsle om kritikkverdige forhold, vennligst
              benytt vår{' '}
              <a
                href="https://avvik.abakus.no"
                rel="noopener noreferrer"
                target="_blank"
              >
                varslingsportal
              </a>
              . Da sikrer du at saken din blir behandlet best mulig, og du har
              mulighet til å følge opp saken samtidig som du forblir anonym.
              <br />
              Les mer i våre{' '}
              <a href="/pages/organisasjon/117-abakus-etiske-retningslinjer">
                Etiske retningslinjer
              </a>
              .
            </span>
          </Card>
          <p>
            Sender du meldingen til en spesifikk komité er det kun lederen av
            komiteen som vil motta meldingen. Dersom du sender til Hovedstyret
            vil hele styret motta meldingen. Både komitéledere og Hovedstyret
            som mottar henvendelser har signert taushetserklæring, og de vil
            kontakte deg og følge opp saken dersom det ønskes.
          </p>

          <Field
            placeholder="Velg mottaker"
            label="Mottaker"
            name="recipient_group"
            value={hsRecipient}
            options={[hsRecipient, ...recipientOptions]}
            component={SelectInput.Field}
            clearable={false}
          />

          <Field
            placeholder="Tittel"
            label="Tittel"
            name="title"
            component={TextInput.Field}
          />

          <Field
            placeholder="Melding"
            label="Melding"
            name="message"
            component={TextArea.Field}
          />

          <p>
            Du har også mulighet til å sende meldingen anonymt. Ved anonym
            innsendelse vil de som mottar meldingen ikke få vite hvem som har
            opprettet den, men de vil da heller ikke ha mulighet til å svare. Av
            den grunn kan ikke ønsker om innsyn sendes inn anonymt.
          </p>

          {!loggedIn && (
            <b>Du er ikke logget inn, så din melding vil være anonym.</b>
          )}

          <Field
            label="Send som anonym avsender"
            name="anonymous"
            component={CheckBox.Field}
            type="checkbox"
            readOnly={!loggedIn}
            disabled={!loggedIn}
          />

          <Field
            name="captchaResponse"
            fieldStyle={{
              width: 304,
            }}
            component={Captcha.Field}
          />

          <SubmitButton>Send</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default ContactForm;
