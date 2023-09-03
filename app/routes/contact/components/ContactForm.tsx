import { Button, Card } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import {
  Form,
  TextInput,
  TextArea,
  CheckBox,
  Captcha,
  SelectInput,
} from 'app/components/Form';
import type { Group } from 'app/models';
import type { ContactForm as ContactFormType } from 'app/reducers/contact';
import type { FormProps } from 'redux-form';

type Props = FormProps & {
  sendContactMessage: (message: ContactFormType) => Promise<any>;
  addToast: (arg0: { message: string }) => void;
  reset: (form: string) => void;
  change: (field: string, value: boolean) => void;
  loggedIn: boolean;
  groups: Array<Group>;
};

const ContactForm = (props: Props) => {
  const { invalid, pristine, submitting, groups } = props;
  const disabledButton = invalid || pristine || submitting;

  const submit = (data) => {
    return props
      .sendContactMessage({
        ...data,
        recipient_group: data.recipient_group.value,
      })
      .then(() => {
        props.reset('contactForm');
        return props.addToast({
          message: 'Melding er sendt.',
        });
      })
      .catch(() =>
        props.addToast({
          message: 'Kunne ikke sende melding.',
        })
      );
  };

  !props.loggedIn && props.change('anonymous', true);
  const hsRecipient = {
    value: null,
    label: 'Hovedstyret',
  };
  const recipientOptions = groups.map((g) => ({
    value: g.id,
    label: g.name,
  }));
  return (
    <Form onSubmit={props.handleSubmit(submit)}>
      <p>
        Dette skjemaet er et verktøy for å nå ut til Abakus sine komiteer eller
        Hovedstyret, enten du har spørsmål, tilbakemeldinger, eller bare ønsker
        å dele informasjon med oss.
      </p>
      <Card severity="info">
        <p>
          Dersom du ønsker å varsle om kritikkverdige forhold, vennligst benytt
          vår{' '}
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
        komiteen som vil motta meldingen. Dersom du sender til Hovedstyret vil
        hele styret motta meldingen. Både komitéledere og Hovedstyret som mottar
        henvendelser har signert taushetserklæring, og de vil kontakte deg og
        følge opp saken dersom det ønskes.
      </p>

      <Field
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
        opprettet den, men de vil da heller ikke ha mulighet til å svare. Av den
        grunn kan ikke ønsker om innsyn sendes inn anonymt.
      </p>

      {!props.loggedIn && (
        <b>Du er ikke logget inn, din melding vil være anonym.</b>
      )}

      <Field
        label="Send som anonym avsender"
        name="anonymous"
        component={CheckBox.Field}
        readOnly={!props.loggedIn}
        disabled={!props.loggedIn}
        normalize={(v) => !!v}
      />

      <Field
        name="captchaResponse"
        fieldStyle={{
          width: 304,
        }}
        component={Captcha.Field}
      />

      <Button disabled={disabledButton} submit>
        Send
      </Button>
    </Form>
  );
};

export default ContactForm;
