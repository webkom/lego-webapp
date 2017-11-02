// @flow

import React from 'react';

import { Content } from 'app/components/Content';
import ContactForm from './ContactForm';
import type { ContactForm as ContactFormType } from 'app/reducers/contact';
import type { FieldProps } from 'redux-form';

type Props = FieldProps & {
  sendContactMessage: (message: ContactFormType) => Promise<*>,
  addNotification: ({ message: string }) => void,
  reset: (form: string) => void,
  change: (field: string, value: boolean) => void,
  loggedIn: boolean
};

const Contact = (props: Props) => {
  return (
    <Content>
      <h1>Kontakt HS</h1>
      <ContactForm {...props} />
    </Content>
  );
};

export default Contact;
