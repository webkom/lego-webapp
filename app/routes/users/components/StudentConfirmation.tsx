import qs from 'qs';
import { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Card from 'app/components/Card';
import { Button } from 'app/components/Form';
import { Container, Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
import styles from './UserConfirmation.css';

type Props = {
  studentConfirmed: boolean;
  loggedIn: boolean;
  submitSucceeded: () => void;
  isStudent: boolean;
};

const StudentConfirmation = ({
  startStudentAuth,
  confirmStudentAuth,
  updateUser,
  isStudent,
  currentUser,
}: Props) => {
  const [authRes, setAuthRes] = useState();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const { search } = useLocation();
  const history = useHistory();
  const { code, state } = qs.parse(search, { ignoreQueryPrefix: true });

  const performStudentAuth = async () => {
    const auth_res = await startStudentAuth();
    const auth_uri = auth_res.payload.url;
    window.location.href = auth_uri;
  };

  const setAbakusMember = async (member: boolean) => {
    await updateUser(
      { ...currentUser, isAbakusMember: member },
      { noRedirect: true }
    );
    setShowMemberModal(false);
  };

  useEffect(() => {
    const validateStudentAuth = async () => {
      if (code && state) {
        const res = await confirmStudentAuth({ code, state });
        setAuthRes(res.payload);
        history.replace({ search: '' });
      }
    };

    validateStudentAuth();
  }, [code, state, confirmStudentAuth, history]);

  useEffect(() => {
    authRes?.status === 'success' && setShowMemberModal(true);
  }, [authRes]);

  return (
    <Container>
      <div>
        <h2>Verifiser studentstatus</h2>

        {isStudent && (
          <Card info>
            <h4>Du er allerede verifisert som student</h4>
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
        )}

        {authRes && !isStudent && (
          <Card
            danger={authRes.status !== 'success'}
            info={authRes.status === 'success'}
          >
            {authRes.status === 'unauthorized' && (
              <>
                <h4>
                  Ingen av dine nåværende studier tillater medlemskap i Abakus:
                </h4>
                <ul>
                  {authRes.studyProgrammes.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p>
                  Dersom du mener dette er en feil, eller ønsker å søke om
                  medlemskap kan du enten:
                </p>
                <ol>
                  <li>
                    Sende en mail til{' '}
                    <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> med
                    dokumentasjon på at du går studiet eller tar fag som
                    tilsvarer studiet.
                  </li>
                  <li>
                    Sende en mail til{' '}
                    <a href="mailto:abakus@abakus.no">abakus@abakus.no</a> med
                    søknad om hvorfor du ønsker å bli medlem av Abakus.
                  </li>
                </ol>
              </>
            )}
          </Card>
        )}

        <Button success onClick={() => performStudentAuth()}>
          Verifiser med FEIDE
        </Button>
        {isStudent && (
          <p className={styles.infoText}>
            Du har allerede verifisert din status. Dersom du har byttet studie
            og ønsker å bli medlem av Abakus, kan du verifisere deg på nytt og
            vi vil oppdatere statusen din dersom du er registrert riktig på
            StudentWeb.
          </p>
        )}

        <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)}>
          <Card info>Din studentstatus ble godkjent!</Card>
          <h2>Vil du bli medlem av Abakus?</h2>
          <div>
            <p className={styles.infoText}>
              Alle som går Kommunikasjonsteknologi & Digital Sikkerhet eller
              Datateknologi kan bli medlem av Abakus. Du må bli medlem for å
              kunne delta på arrangementer, kurs og annet Abakus tilbyr. Vi
              anbefaler alle nye studenter å melde seg inn. Du kan lese mer om{' '}
              <a
                href="https://abakus.no/pages/info-om-abakus"
                rel="noopener noreferrer"
                target="_blank"
              >
                Abakus
              </a>{' '}
              og{' '}
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

          <Flex row>
            <Button danger onClick={() => setAbakusMember(false)}>
              Jeg vil ikke bli medlem
            </Button>
            <Button success onClick={() => setAbakusMember(true)}>
              Jeg vil bli medlem
            </Button>
          </Flex>
        </Modal>
      </div>
    </Container>
  );
};

export default StudentConfirmation;
