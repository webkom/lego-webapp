// @flow

import { Helmet } from 'react-helmet-async';
import type { FormProps } from 'redux-form';

import { Content } from 'app/components/Content';
import type { Group } from 'app/models';
import type { ContactForm as ContactFormType } from 'app/reducers/contact';
import ContactForm from './ContactForm';

type Props = {
  sendContactMessage: (message: ContactFormType) => Promise<*>,
  addToast: ({ message: string }) => void,
  reset: (form?: string) => void,
  change: (field: string, value: boolean) => void,
  loggedIn: boolean,
  groups: Array<Group>,
} & FormProps;

const Contact = (props: Props) => {
  return (
    <Content>
      <Helmet title="Kontakt" />
      <h1>Kontaktskjema for Abakus</h1>
      <ContactForm {...props} />
    </Content>
  );
};

export default Contact;
