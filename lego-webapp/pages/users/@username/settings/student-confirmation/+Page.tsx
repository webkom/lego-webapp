import {
  ButtonGroup,
  Card,
  Modal,
  useClearSearchParams,
} from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { ContentMain } from '~/components/Content';
import { Button } from '~/components/Form';
import {
  type ConfirmStudentAuthResponse,
  confirmStudentAuth,
  startStudentAuth,
  updateUser,
} from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from '../../../registration/RegistrationPage.module.css';
import type { RejectedPromiseAction } from '~/redux/middlewares/promiseMiddleware';

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
        Sende en e-post til{' '}
        <a href="mailto:webkom@abakus.no">webkom@abakus.no</a> med dokumentasjon
        på at du går eller tar fag som tilhører et av studiene over.
      </li>
      <li>
        Sende en e-post til{' '}
        <a href="mailto:abakus@abakus.no">abakus@abakus.no</a> med søknad om
        hvorfor du ønsker å bli medlem av Abakus. Det trenger ikke være en stor
        søknad :)
      </li>
    </ol>
  </div>
);

const StudentConfirmation = () => {
  const pageContext = usePageContext();
  const clearSearchParams = useClearSearchParams();
  const dispatch = useAppDispatch();
  const [authRes, setAuthRes] = useState<ConfirmStudentAuthResponse>();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const { code, state } = pageContext.urlParsed.search;

  const currentUser = useCurrentUser();

  useEffect(() => {
    const validateStudentAuth = () => {
      if (code && state) {
        dispatch(confirmStudentAuth(code, state))
          .then((res) => {
            setAuthRes(res.payload);
          })
          .catch((err: RejectedPromiseAction) => {
            setAuthRes(err.payload.response.jsonData);
          });
        clearSearchParams();
      }
    };

    validateStudentAuth();
  }, [code, state, dispatch, clearSearchParams]);

  useEffect(() => {
    authRes?.status === 'success' && setShowMemberModal(true);
  }, [authRes]);

  if (!currentUser) {
    return null;
  }

  const performStudentAuth = async () => {
    const auth_res = await dispatch(startStudentAuth());
    const auth_uri = auth_res.payload.url;
    window.location.href = auth_uri;
  };

  const setAbakusMember = async (member: boolean) => {
    await dispatch(updateUser({ ...currentUser, isAbakusMember: member }));
    setShowMemberModal(false);
  };

  return (
    <ContentMain>
      {currentUser.isStudent === null && (
        <span>
          For å kunne bli medlem i Abakus og få mulighet til å delta på
          arrangementer, få tilgang til bilder og interessegrupper og mer må du
          verifisere at du går enten Cybersikkerhet og datakommunikasjon eller
          Datateknologi. Ved å trykke på knappen under gir du Abakus tilgang til
          dine studier og fag i StudentWeb gjennom FEIDE slik at vi kan
          registrere deg som medlem.
        </span>
      )}

      {currentUser.isStudent !== null &&
        (currentUser.isStudent ? (
          <Card severity="info">
            <Card.Header>Du er verifisert som student</Card.Header>
            <span className={styles.infoText}>
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
            </span>
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
              <span>{authRes.detail}</span>
            </>
          )}
        </Card>
      )}

      <Button success onPress={() => performStudentAuth()}>
        Verifiser med FEIDE
      </Button>

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
            <a href="/pages/info-om-abakus">Abakus</a> og{' '}
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
            <a href="/users/me/settings/profile">innstillinger</a>.
          </p>
        </div>

        <ButtonGroup>
          <Button dark onPress={() => setAbakusMember(false)}>
            Jeg vil ikke bli medlem
          </Button>
          <Button success onPress={() => setAbakusMember(true)}>
            Jeg vil bli medlem
          </Button>
        </ButtonGroup>
      </Modal>
    </ContentMain>
  );
};

export default StudentConfirmation;
