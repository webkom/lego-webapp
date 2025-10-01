import { Card, Flex, Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { useIsLoggedIn } from '~/redux/slices/auth';
import ContactForm from './ContactForm';

const Contact = () => {
  const loggedIn = useIsLoggedIn();

  return (
    <Page title="Kontaktskjema for Abakus">
      <Helmet title="Kontakt" />
      <Flex column gap="var(--spacing-md)">
        <p>
          Dette skjemaet er et verktøy for å nå ut til Abakus sine komiteer
          eller Hovedstyret, enten du har spørsmål, tilbakemeldinger, eller bare
          ønsker å dele informasjon med oss.
        </p>
        <Card severity="info">
          <span>
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
            mulighet til å følge opp saken samtidig som du forblir <strong>anonym</strong>.
            <br />
            Les mer i våre{' '}
            <a href="/pages/organisasjon/117-abakus-etiske-retningslinjer">
              Etiske retningslinjer
            </a>
            .
          </span>
        </Card>

      {loggedIn ? (
        <ContactForm />
      ) : (
        <span>
          <h3>Du er ikke innlogget</h3>
          Du må være innlogget for å benytte dette skjemaet. Dersom du ikke har
          abakus bruker se andre kontaktmuligheter under{' '}
          <a href="/pages/info-om-abakus#contact">Om Abakus - Kontakt Oss</a>.
        </span>
      )}
      </Flex>
    </Page>
  );
};

export default Contact;
