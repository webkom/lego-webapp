import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styles from './InterestGroup.module.css';

const InterestGroupApplyCash = () => {
  return (
    <Page
      title="Send inn en pengesøknad"
      back={{ href: '/interestgroups', label: 'Interessegrupper' }}
    >
      <Helmet title="Send inn en pengesøknad" />

      <div className={styles.interestGroupText}>
        <h2>Hvem kan søke</h2>
        <p>
          Et hvert medlem av en interessegruppe kan sende inn en pengesøknad på
          vegne av gruppa.
        </p>
        <p>
          For å få penger må interessegruppen bestå av flere aktive medlemmer i
          Abakus, og ha en oversikt over hva dere planlegger å bruke pengene på.
        </p>
        <h2>Hvordan søke</h2>
        <p>
          Ønsker din gruppe å søke støtte, send en søknad på e-post til{' '}
          <Link to="mailto:interessegrupper@abakus.no">
            interessegrupper@abakus.no
          </Link>
          .
        </p>
        <p>
          Bruk følgende format i emnefeltet til e-posten:
          <br />
          [Pengesøknad] [Gruppenavn] Hva det gjelder
        </p>
        <p>Legg ved utfylt mal for pengesøknad:</p>
        <p>
          <Link
            to="https://drive.google.com/file/d/1A0-bvDZwbHlQoZWPj8oXoeV_0go1qoy5/view?usp=sharing"
            target="_blank"
          >
            Mal til pengesøknad
          </Link>
        </p>
        <p>
          <Link
            to="https://drive.google.com/file/d/11MEIfLTHI1q0T76I1l7E5qllepH2PN3S/view?usp=sharing"
            target="_blank"
          >
            Eksempel på utfylt søknad
          </Link>
        </p>
        <p>
          Søknaden vil så bli vurdert av Abakus. Det er altså ikke en garanti å
          få penger, men hvis formålet er noe Abakus-medlemmer kan nyte godt av,
          lover det godt for søknaden. Ryktene sier også at Abakus har øremerket
          en del penger her og, så ikke nøl med å søke!
        </p>
        <p>
          Høres dette vrient ut, så fortvil ikke: Vi er her for å bistå. Bare
          send en mail til{' '}
          <Link to="mailto:interessegrupper@abakus.no">
            interessegrupper@abakus.no
          </Link>{' '}
          med spørsmål så får dere hjelp med å sette opp en søknad slik at dere
          kan søke om støtte.
        </p>
        <h2>Eksempler på tidligere søknader</h2>
        <p>
          Eksempler på søknader vi har godkjent tidligere er mat til turer i
          regi av Turgruppa, startkontigenter i forbindelse med løp Abarun
          deltar på, penner til Abaspin o.l.
        </p>
        <p>
          Det er ikke bare økonomisk støtte du kan få som interessegruppe. I
          Abakus sitter det mange personer som kan hjelpe med for eksempel
          bestilling av buss, annonser på abakus.no eller plakater for
          arrangement – ta kontakt.
        </p>
      </div>
    </Page>
  );
};

export default InterestGroupApplyCash;
