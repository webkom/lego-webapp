import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import ContactForm from './ContactForm';

const Contact = () => {
  return (
    <Content>
      <Helmet title="Kontakt" />
      <h1>Kontaktskjema for Abakus</h1>
      <ContactForm />
    </Content>
  );
};

export default Contact;
