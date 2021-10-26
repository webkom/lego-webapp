// @flow

import type { Group } from 'app/models';
import { Helmet } from 'react-helmet';
import { Content } from 'app/components/Content';
import ContactForm from './ContactForm';
import type { ContactForm as ContactFormType } from 'app/reducers/contact';
import type { FormProps } from 'redux-form';

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
