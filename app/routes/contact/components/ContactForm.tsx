import { Field } from "redux-form";
import type { Group } from "app/models";
import Button from "app/components/Button";
import { Form, TextInput, TextArea, CheckBox, Captcha, SelectInput } from "app/components/Form";
import type { ContactForm as ContactFormType } from "app/reducers/contact";
import type { FormProps } from "redux-form";
type Props = FormProps & {
  sendContactMessage: (message: ContactFormType) => Promise<any>;
  addToast: (arg0: {
    message: string;
  }) => void;
  reset: (form: string) => void;
  change: (field: string, value: boolean) => void;
  loggedIn: boolean;
  groups: Array<Group>;
};

const ContactForm = (props: Props) => {
  const {
    invalid,
    pristine,
    submitting,
    groups
  } = props;
  const disabledButton = invalid || pristine || submitting;

  const submit = data => {
    return props.sendContactMessage({ ...data,
      recipient_group: data.recipient_group.value
    }).then(() => {
      props.reset('contactForm');
      return props.addToast({
        message: 'Melding er sendt.'
      });
    }).catch(() => props.addToast({
      message: 'Kunne ikke sende melding.'
    }));
  };

  !props.loggedIn && props.change('anonymous', true);
  const hsRecipient = {
    value: null,
    label: 'Hovedstyret'
  };
  const recipientOptions = groups.map(g => ({
    value: g.id,
    label: g.name
  }));
  return <Form onSubmit={props.handleSubmit(submit)}>
      <p>
        Dette skjemaet kan benyttes for å kontakte Abakus sine komiteer eller
        Hovedstyret. Dersom du har opplevd avvik eller ubehagelige hendelser i
        forbindelse med Abakus, ønsker vi gjerne at dette meldes fra om her.
        Send oss gjerne også spørsmål, feedback eller ting du ønsker å fortelle
        oss, for eksempel om du ønsker å avtale tid for innsyn i HSP-avtalen.
      </p>
      <p>
        Sender du meldingen til en spesifikk komité er det kun lederen av
        komiteen som vil motta meldingen. Om du sender til Hovedstyret vil hele
        styret motta meldingen.
      </p>
      <p>
        Skjemaet kan både benyttes til å sende inn en anonym henvendelse, eller
        en med avsender for videre oppfølging. Både komitéledere og Hovedstyret
        som mottar henvendelser har signert taushetserklæring, og de vil
        kontakte deg og følge opp saken dersom det ønskes.
      </p>
      <Field placeholder="Velg mottaker" label="Mottaker" name="recipient_group" value={hsRecipient} options={[hsRecipient, ...recipientOptions]} component={SelectInput.Field} clearable={false} />

      <Field placeholder="Tittel" label="Tittel" name="title" component={TextInput.Field} />

      <Field placeholder="Melding" label="Melding" name="message" component={TextArea.Field} />

      <p>
        Du kan velge å sende meldingen med anonym avsender. De som mottar
        meldingen vil ikke få vite hvem som har opprettet meldingen. De vil da
        heller ikke ha mulighet til å svare på meldingen. Ønsker om innsyn kan
        ikke sendes inn anonymt.
      </p>

      {!props.loggedIn && <b>Du er ikke logget inn, din melding vil være anonym.</b>}

      <Field label="Send som anonym avsender" name="anonymous" component={CheckBox.Field} readOnly={!props.loggedIn} disabled={!props.loggedIn} normalize={v => !!v} />

      <Field name="captchaResponse" fieldStyle={{
      width: 304
    }} component={Captcha.Field} />

      <Button disabled={disabledButton} submit>
        Send
      </Button>
    </Form>;
};

export default ContactForm;