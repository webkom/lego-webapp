// @flow

import React from 'react';
import { Field } from 'redux-form';

import Button from 'app/components/Button';
import {
  Form,
  TextInput,
  TextArea,
  CheckBox,
  Captcha
} from 'app/components/Form';
import type { ContactForm as ContactFormType } from 'app/reducers/contact';
import type { FieldProps } from 'redux-form';

type Props = FieldProps & {
  sendContactMessage: (message: ContactFormType) => Promise<*>,
  addNotification: ({ message: string }) => void,
  reset: (form: string) => void,
  change: (field: string, value: boolean) => void,
  loggedIn: boolean
};

const ContactForm = (props: Props) => {
  const { invalid, pristine, submitting } = props;
  const disabledButton = invalid || pristine || submitting;

  const submit = data => {
    return props
      .sendContactMessage(data)
      .then(() => {
        props.reset('contactForm');
        return props.addNotification({ message: 'Melding er sendt til HS.' });
      })
      .catch(() =>
        props.addNotification({ message: 'Kunne ikke sende melding.' })
      );
  };

  !props.loggedIn && props.change('anonymous', true);

  return (
    <Form onSubmit={props.handleSubmit(submit)}>
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
        Du kan velge å sende meldingen med anonym avsender, HS vil ikke få vite
        hvem som har opprettet meldingen. HS vil da heller ikke ha mulighet til
        å svare på meldingen.{' '}
        {!props.loggedIn && (
          <b>Du er ikke logget inn, din melding vil være anonym.</b>
        )}
      </p>

      <Field
        label="Send som anonym avsender"
        name="anonymous"
        normalize={v => !!v}
        component={CheckBox.Field}
        readOnly={!props.loggedIn}
        disabled={!props.loggedIn}
      />

      <Field
        name="captchaResponse"
        fieldStyle={{ width: 304 }}
        component={Captcha.Field}
      />

      <Button disabled={disabledButton} submit>
        Send
      </Button>
    </Form>
  );
};

export default ContactForm;
