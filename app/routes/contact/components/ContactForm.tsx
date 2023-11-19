import { Button, Card } from '@webkom/lego-bricks';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom-v5-compat';
import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import {
  Form,
  TextInput,
  TextArea,
  CheckBox,
  Captcha,
  SelectInput,
  LegoFinalForm,
} from 'app/components/Form';
import { GroupType } from 'app/models';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectGroup, selectGroupsWithType } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, maxLength, required } from 'app/utils/validation';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});

const commiteeGroupType = GroupType.Committee;
const revueBoardGroupId = 59;

const ContactForm = () => {
  const commitees = useAppSelector((state) =>
    selectGroupsWithType(state, {
      groupType: commiteeGroupType,
    })
  );
  const revueBoard = useAppSelector((state) =>
    selectGroup(state, {
      groupId: revueBoardGroupId,
    })
  );
  const groups = [...commitees, revueBoard];

  const loggedIn = useAppSelector((state) => selectIsLoggedIn(state));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllWithType(commiteeGroupType));
    dispatch(fetchGroup(revueBoardGroupId));
  }, [dispatch]);

  const onSubmit = (data, form) => {
    dispatch(
      sendContactMessage({
        ...data,
        recipient_group: data.recipient_group.value,
      })
    )
      .then(() => {
        form.reset();
        dispatch(
          addToast({
            message: 'Melding er sendt.',
          })
        );
      })
      .catch(() =>
        dispatch(
          addToast({
            message: 'Kunne ikke sende melding.',
          })
        )
      );
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
      initialValues={{
        anonymous: !loggedIn,
      }}
      validateOnSubmitOnly
    >
      {({ handleSubmit, submitting, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <p>
            Dette skjemaet er et verktøy for å nå ut til Abakus sine komiteer
            eller Hovedstyret, enten du har spørsmål, tilbakemeldinger, eller
            bare ønsker å dele informasjon med oss.
          </p>
          <Card severity="info">
            <p>
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
              <Link to="/pages/organisasjon/117-abakus-etiske-retningslinjer">
                Etiske retningslinjer
              </Link>
              .
            </p>
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
            parse={(v) => !!v}
          />

          <Field
            name="captchaResponse"
            fieldStyle={{
              width: 304,
            }}
            component={Captcha.Field}
          />

          <Button disabled={submitting || pristine} submit>
            Send
          </Button>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default ContactForm;
