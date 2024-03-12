import { Helmet } from 'react-helmet-async';
import p4 from 'app/assets/sommerfest/4.png';
import { Content } from 'app/components/Content';
import Sommerfest from 'app/components/Sommerfest/Sommerfest';
import ContactForm from './ContactForm';
import styles from './ContactForm.css';

const Contact = () => {
  return (
    <Content>
      <Helmet title="Kontakt" />
      <h1>Kontaktskjema for Abakus</h1>
      <Sommerfest src={p4} className={styles.sommerfest} />
      <ContactForm />
    </Content>
  );
};

export default Contact;
