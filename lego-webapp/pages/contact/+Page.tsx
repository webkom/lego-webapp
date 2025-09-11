import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import ContactForm from './ContactForm';

const Contact = () => {
  return (
    <Page title="Kontaktskjema for Abakus">
      <Helmet title="Kontakt" />
      <ContactForm />
    </Page>
  );
};

export default guardLogin(Contact);
