import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import {
  Form,
  TextInput,
  RadioButton,
  RadioButtonGroup,
  Button,
  Captcha,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import { Container, Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import type { ReduxFormProps } from 'app/types';
import { createValidator, required } from 'app/utils/validation';
import styles from './UserConfirmation.css';

type Props = {
  studentConfirmed: boolean;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  sendStudentConfirmationEmail: (arg0: Record<string, any>) => void;
  loggedIn: boolean;
  submitSucceeded: () => void;
  isStudent: boolean;
  push: (arg0: string) => void;
} & ReduxFormProps;

const StudentConfirmation = ({
  studentConfirmed,
  handleSubmit,
  sendStudentConfirmationEmail,
  loggedIn,
  submitSucceeded,
  isStudent,
  invalid,
  pristine,
  submitting,
  push,
}: Props) => {
  if (isStudent) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>Du er allerede verifisert!</h2>
        </div>
      </Container>
    );
  }

  if (submitSucceeded) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>Sjekk e-posten din!</h2>
        </div>
      </Container>
    );
  }

  if (studentConfirmed !== null) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>{studentConfirmed ? 'Du er nå verifisert!' : 'Ugyldig token'}</h2>
          <Link to="/">Gå tilbake til hovedsiden</Link>
        </div>
      </Container>
    );
  }

  const handleSendConfirmation = (data) => {
    const payload = {
      ...data,
      studentUsername: data.studentUsername.replace('@stud.ntnu.no', ''),
    };
    return sendStudentConfirmationEmail(payload);
  };

  const disabledButton = invalid || pristine || submitting;
  return (
    <Container>
      <div>
        <h2>Verifiser student-e-post</h2>
        <Form onSubmit={handleSubmit(handleSendConfirmation)}>
          <Tooltip content="Brukernavnet du logger inn på NTNU med. Dette er delen som er foran @stud.ntnu.no. OBS: Ikke skriv inn hele e-posten">
            <Field
              name="studentUsername"
              placeholder="NTNU-brukernavn"
              label="NTNU-brukernavn"
              component={TextInput.Field}
            />
          </Tooltip>
          <RadioButtonGroup name="course" label="Hvilken linje tilhører du?">
            <Field
              name="studentCompScience"
              label="Datateknologi"
              component={RadioButton.Field}
              inputValue="data"
            />
            <Field
              name="studentCommunicationTechnology"
              label="Kommunikasjonsteknologi"
              component={RadioButton.Field}
              inputValue="komtek"
            />
          </RadioButtonGroup>
          <RadioButtonGroup
            name="isTwoYears"
            label={
              <Flex alignItems="center" gap={5}>
                <div>Begynner du på 2-årig eller 5-årig master?</div>
                <Tooltip content="Huk av 2-årig master her kun hvis du begynner på to-arig master studiet på din respektive linje. Dvs. du har en bachelor fra før av. Begynner du i første klasse og skal studere i 5 år, huk av 5-årig master.">
                  <Icon name="information-circle-outline" size={20} />
                </Tooltip>
              </Flex>
            }
          >
            <Field
              name="isTwoYearsYes"
              label="2-årig master"
              component={RadioButton.Field}
              inputValue="true"
            />
            <Field
              name="isTwoYearsNo"
              label="5-årig master"
              component={RadioButton.Field}
              inputValue="false"
            />
          </RadioButtonGroup>
          <RadioButtonGroup name="member" label="Vil du bli medlem av Abakus?">
            <Flex>
              <div
                style={{
                  marginLeft: '5px',
                }}
              >
                <p className={styles.infoText}>
                  Alle som går Kommunikasjonsteknologi & Digital Sikkerhet eller
                  Datateknologi kan bli medlem av Abakus. Du må bli medlem for å
                  kunne delta på arrangementer, kurs og annet Abakus tilbyr. Vi
                  anbefaler alle nye studenter å melde seg inn. Du kan lese mer
                  om{' '}
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
              </div>
            </Flex>
            <Field
              name="studentIsMemberYes"
              label="Ja"
              component={RadioButton.Field}
              inputValue="true"
            />
            <Field
              name="studentIsMemberNo"
              label="Nei"
              component={RadioButton.Field}
              inputValue="false"
            />
          </RadioButtonGroup>
          <Field
            name="captchaResponse"
            fieldStyle={{
              width: 304,
            }}
            component={Captcha.Field}
          />
          <Button submit disabled={disabledButton}>
            Verifiser
          </Button>
        </Form>
      </div>
    </Container>
  );
};

const validate = createValidator({
  studentUsername: [required()],
  course: [required()],
  member: [required()],
  isTwoYears: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});
export default reduxForm({
  form: 'ConfirmationForm',
  initialValues: {
    isTwoYears: 'false',
    member: 'true',
  },
  validate,
})(StudentConfirmation);
