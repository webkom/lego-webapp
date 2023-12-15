import { Card, Flex, Modal } from '@webkom/lego-bricks';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import {
  type ConfirmStudentAuthResponse,
  confirmStudentAuth,
  startStudentAuth,
  updateUser,
} from 'app/actions/UserActions';
import { Button } from 'app/components/Form';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch } from 'app/store/hooks';
import styles from './UserConfirmation.css';
import type { RejectedPromiseAction } from 'app/store/middleware/promiseMiddleware';

const NotEligibleInfo = () => (
  <div className={styles.notEligibleInfo}>
    <p>
      Dersom du mener dette er en feil, eller ønsker å søke om medlemskap kan du
      enten:
    </p>
    <ol className={styles.infoList}>
      <li>
        Påse at du er har Datateknologi eller Cybersikkerhet og
        datakommunikasjon som studie i StudentWeb og verifisere på nytt.
      </li>
      <li>
        Sende en mail til <a href="mailto:webkom@abakus.no">webkom@abakus.no</a>{' '}
        med dokumentasjon på at du går eller tar fag som tilhører et av studiene
        over.
      </li>
      <li>
        Sende en mail til <a href="mailto:abakus@abakus.no">abakus@abakus.no</a>{' '}
        med søknad om hvorfor du ønsker å bli medlem av Abakus. Det trenger ikke
        være en stor søknad :)
      </li>
    </ol>
  </div>
);

const StudentConfirmation = () => {
  const [authRes, setAuthRes] = useState<ConfirmStudentAuthResponse>();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const { search } = useLocation();
  const history = useHistory();
  const { code, state } = qs.parse(search, { ignoreQueryPrefix: true });

  const { currentUser } = useUserContext();

  const dispatch = useAppDispatch();

  const performStudentAuth = async () => {
    const auth_res = await dispatch(startStudentAuth());
    const auth_uri = auth_res.payload.url;
    window.location.href = auth_uri;
  };

  const setAbakusMember = async (member: boolean) => {
    await dispatch(
      updateUser(
        { ...currentUser, isAbakusMember: member },
        { noRedirect: true }
      )
    );
    setShowMemberModal(false);
  };

  useEffect(() => {
    console.log(code, state);

    const validateStudentAuth = () => {
      console.log(code, state);
      if (code && state) {
        dispatch(confirmStudentAuth(code, state))
          .then((res) => {
            setAuthRes(res.payload);
          })
          .catch((err: RejectedPromiseAction) => {
            setAuthRes(err.payload.response.jsonData);
          });
        history.replace({ search: '' });
      }
    };

    validateStudentAuth();
  }, [code, state, history, dispatch]);

  useEffect(() => {
    authRes?.status === 'success' && setShowMemberModal(true);
  }, [authRes]);

  return (
    <>
      <h2>Verifiser studentstatus</h2>

      {currentUser.isStudent === null && (
        <p>
          For å kunne bli medlem i Abakus og få mulighet til å delta på
          arrangementer, få tilgang til bilder og interessegrupper og mer må du
          verifisere at du går enten Cybersikkerhet og datakommunikasjon eller
          Datateknologi. Ved å trykke på knappen under gir du Abakus tilgang til
          dine studier og fag i StudentWeb gjennom FEIDE slik at vi kan
          registrere deg som medlem.
        </p>
      )}

      {currentUser.isStudent !== null &&
        (currentUser.isStudent ? (
          <Card severity="info">
            <Card.Header>Du er verifisert som student</Card.Header>
            <p className={styles.infoText}>
              Dersom du ønsker å endre trinn eller studie, vennligst send en
              forespørsel til{' '}
              <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> med
              dokumentasjon på ditt trinn og studie. Gyldig dokumentasjon kan
              være:
              <ul className={styles.programmeList}>
                <li>
                  Screenshot eller dokumentasjon fra studentWeb (at du tar fag
                  tilhørende ditt ønsket trinn er nok)
                </li>
                <li>Dokumentasjon fra institutt/fakultet</li>
              </ul>
            </p>
          </Card>
        ) : (
          <Card severity="danger">
            <Card.Header>
              Informasjonen vi har hentet om deg fra StudentWeb gir ikke
              mulighet for automatisk medlemskap i Abakus
            </Card.Header>
            <NotEligibleInfo />
          </Card>
        ))}

      {authRes && authRes.status !== 'success' && (
        <Card severity="danger">
          {authRes.status === 'unauthorized' && (
            <>
              <Card.Header>
                Ingen av dine nåværende studier tillater medlemskap i Abakus:
              </Card.Header>
              <ul className={styles.programmeList}>
                {authRes.studyProgrammes.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <NotEligibleInfo />
            </>
          )}
          {authRes.status === 'error' && (
            <>
              <Card.Header>
                En feil oppsto under validering av din studentstatus:
              </Card.Header>
              <p>{authRes.detail}</p>
            </>
          )}
        </Card>
      )}

      <Button success onClick={() => performStudentAuth()}>
        Verifiser med FEIDE
      </Button>
      {currentUser.isStudent !== null && (
        <p className={styles.infoText}>
          Du har allerede verifisert din status. Dersom du har byttet studie og
          ønsker å bli medlem av Abakus, kan du verifisere deg på nytt og vi vil
          oppdatere statusen din dersom du er registrert riktig på StudentWeb.
        </p>
      )}

      <Modal
        show={showMemberModal}
        contentClassName={styles.membershipModalContent}
        onHide={() => setShowMemberModal(false)}
      >
        <Card severity="success">
          <Card.Header>Din studentstatus ble godkjent!</Card.Header>
          <p>
            Du har blitt satt i gruppen <b>{authRes?.grade}</b>
          </p>
        </Card>
        <h2>Vil du bli medlem av Abakus?</h2>
        <div>
          <p className={styles.infoText}>
            Alle som går Cybersikkerhet og datakommunikasjon eller Datateknologi
            kan bli medlem av Abakus. Du må bli medlem for å kunne delta på
            arrangementer, kurs og annet Abakus tilbyr. Vi anbefaler alle nye
            studenter å melde seg inn. Du kan lese mer om{' '}
            <Link to="/pages/info-om-abakus">Abakus</Link> og{' '}
            <a
              href="https://statutter.abakus.no#medlemskap"
              rel="noopener noreferrer"
              target="_blank"
            >
              medlemskapet.{' '}
            </a>
            Det koster ingenting å være medlem av Abakus.
          </p>
          <p className={styles.infoText}>
            Du kan alltids endre medlemskapet ditt på dine{' '}
            <Link to="/users/me/settings/profile">innstillinger</Link>.
          </p>
        </div>

        <Flex>
          <Button dark onClick={() => setAbakusMember(false)}>
            Jeg vil ikke bli medlem
          </Button>
          <Button success onClick={() => setAbakusMember(true)}>
            Jeg vil bli medlem
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default StudentConfirmation;
