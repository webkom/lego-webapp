import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import styles from '../InterestGroup.module.css';

const InterestGroupApplyCreate = () => {
  return (
    <Page
      title="Opprett interessegruppe"
      back={{ href: '/interest-groups', label: 'Interessegrupper' }}
    >
      <Helmet title="Opprett interessegruppe" />

      <div className={styles.interestGroupText}>
        <p>Vil du starte en interessegruppe? Da er du på riktig sted!</p>
        <p>
          Før du oppretter en interessegruppe kan du sjekke{' '}
          <a href="/interest-groups">oversikten over interessegrupper</a> for å
          se om det allerede finnes en gruppe fra før.
        </p>

        <br />

        <p>
          Det er meget lett å bli en interessegruppe, bare send en mail til{' '}
          <a href="mailto:interessegrupper@abakus.no">
            interessegrupper@abakus.no
          </a>{' '}
          med:
        </p>
        <ul>
          <li>Navn på gruppen</li>
          <li>Kontaktinformasjon til leder av gruppen</li>
          <li>En kort beskrivelse av hva dere gjør</li>
        </ul>
        <p>
          Deretter tar vi kontakt med deg og hjelper deg med oppstartsprosessen!
        </p>
        <br />
        <p>
          Merk at det er et minimumskrav å være 3 abakus-studenter i
          opprettelsen av en interessegruppe.
        </p>
      </div>
    </Page>
  );
};

export default InterestGroupApplyCreate;
