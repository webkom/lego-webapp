import {
  Button,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  ProgressBar,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Captcha, TextInput } from 'app/components/Form';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import type {
  EventRegistration,
  EventRegistrationStatus,
  Penalty,
  Event,
} from 'app/models';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { selectUserByUsername } from 'app/reducers/users';
import type { CurrentUser } from 'app/store/models/User';
import {
  paymentSuccess,
  paymentManual,
  sumPenalties,
  penaltyHours,
  registrationIsClosed,
  getEventSemesterFromStartTime,
  allConsentsAnswered,
  toReadableSemester,
} from '../utils';
import styles from './Event.css';
import withCountdown from './JoinEventFormCountdownProvider';
import PaymentRequestForm from './StripeElement';

export type Props = {
  title?: string;
  event: Event;
  registration: EventRegistration | null | undefined;
  pendingRegistration: EventRegistration | null | undefined;
  currentUser: CurrentUser;
  onSubmit: (arg0: Record<string, any>) => void;
  createPaymentIntent: () => Promise<any>;
  handleSubmit: /*TODO: SubmitHandler<>*/ (arg0: any) => void;

  /*TODO: & ReduxFormProps */
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
  registrationPending: boolean;
  formOpen: boolean;
  captchaOpen: boolean;
  buttonOpen: boolean;
  registrationOpensIn: string | null | undefined;
  penalties: Penalty[];
  touch: (field: string) => void;
};
type SpotsLeftProps = {
  activeCapacity: number;
  spotsLeft: number;
};

const SubmitButton = ({
  onSubmit,
  disabled,
  type,
  title,
  showPenaltyNotice,
}: {
  onSubmit?: () => void;
  disabled: boolean;
  type: string;
  title: string;
  showPenaltyNotice: boolean;
}) => {
  if (type === 'register') {
    return (
      <Button
        className={styles.registrationBtn}
        onClick={onSubmit}
        disabled={disabled}
      >
        {title}
      </Button>
    );
  }

  const message = (
    <Flex column>
      <span>Er du sikker på at du vil avregistrere deg?</span>
      {showPenaltyNotice && <b>NB: Avregistrering medfører én prikk</b>}
    </Flex>
  );
  return (
    <ConfirmModal
      title="Avregistrer"
      message={message}
      onConfirm={() => {
        onSubmit && onSubmit();
        return Promise.resolve();
      }}
    >
      {({ openConfirmModal }) => (
        <Button
          onClick={openConfirmModal}
          className={styles.registrationBtn}
          danger
          disabled={disabled}
        >
          <Icon name="person-remove" size={19} />
          {title}
        </Button>
      )}
    </ConfirmModal>
  );
};

const RegistrationPending = ({
  reg_status,
}: {
  reg_status?: EventRegistrationStatus;
}) => (
  <Card className={styles.registrationPending}>
    <span className={styles.registrationPendingHeader}>
      <h3>
        Vi behandler din{' '}
        {reg_status === 'PENDING_UNREGISTER'
          ? 'avregistrering'
          : 'registrering'}
        .
      </h3>
    </span>
    <p>
      Det kan ta et øyeblikk eller to.
      <br />
      <i>Du trenger ikke refreshe siden.</i>
      <Tooltip
        content={
          <span>
            Avhengig av last på våre servere kan dette ta litt tid. Ved mistanke
            om problemer, kan du følge med i{' '}
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://abakus-ntnu.slack.com/archives/C0L63DZRU"
            >
              #webkom
            </a>{' '}
            på slack for eventuelle oppdateringer.
          </span>
        }
      >
        <Icon name="information-circle-outline" size={20} />
      </Tooltip>
    </p>
    <ProgressBar />
  </Card>
);

const PaymentForm = ({
  createPaymentIntent,
  event,
  currentUser,
  registration,
}: {
  createPaymentIntent: () => Promise<void>;
  event: Event;
  currentUser: CurrentUser;
  registration: EventRegistration;
}) => (
  <div
    style={{
      width: '100%',
    }}
  >
    <h3>Betaling</h3>
    <div className={styles.eventPrice} title="Special price for you my friend!">
      Du skal betale{' '}
      <b>{(event.price / 100).toFixed(2).replace('.', ',')} kr</b>
    </div>
    <PaymentRequestForm
      paymentError={registration.paymentError}
      createPaymentIntent={createPaymentIntent}
      event={event}
      currentUser={currentUser}
      paymentStatus={registration.paymentStatus}
      clientSecret={registration.clientSecret}
    />
  </div>
);

const SpotsLeft = ({ activeCapacity, spotsLeft }: SpotsLeftProps) => {
  // If the pool has infinite capacity or spotsLeft isn't calculated don't show the message
  if (!activeCapacity || spotsLeft === null) return null;

  if (spotsLeft <= 0 && activeCapacity > 0) {
    return (
      <div>
        Det er ingen plasser igjen, og du vil bli registrert til venteliste.
      </div>
    );
  }

  const word = spotsLeft > 1 ? 'plasser' : 'plass';
  return (
    <div>
      Det er {spotsLeft} {word} igjen.
    </div>
  );
};

const JoinEventForm = (props: Props) => {
  const submitWithType = (handleSubmit, feedbackName, type) => {
    if (type === 'unregister') {
      return handleSubmit(() =>
        props.onSubmit({
          type,
        })
      );
    }

    return handleSubmit((values) => {
      const feedback = values[feedbackName];

      if (event.feedbackRequired && !feedback) {
        throw new SubmissionError({
          feedbackRequired:
            'Tilbakemelding er påkrevet for dette arrangementet',
        });
      }

      return props.onSubmit({
        captchaResponse: values.captchaResponse,
        feedback,
        type,
      });
    });
  };

  const {
    title,
    event,
    registration,
    pendingRegistration,
    currentUser,
    handleSubmit,
    createPaymentIntent,
    invalid,
    pristine,
    submitting,
    buttonOpen,
    formOpen,
    penalties,
    captchaOpen,
    registrationOpensIn,
  } = props;
  const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
  const registrationType = !registration ? 'register' : 'unregister';
  const feedbackName = getFeedbackName(event);
  const feedbackLabel = getFeedbackLabel(event);
  const isInvalid = registrationOpensIn !== null || invalid;
  const isPristine = event.feedbackRequired && pristine;
  const disabledButton = !registration
    ? isInvalid || isPristine || submitting
    : false;
  const disabledForUser = !formOpen && !event.activationTime && !registration;
  const showPenaltyNotice = Boolean(
    event.heedPenalties &&
      moment().isAfter(event.unregistrationDeadline) &&
      registration &&
      registration.pool
  );
  const registrationPending =
    pendingRegistration?.status === 'PENDING_REGISTER' ||
    pendingRegistration?.status === 'PENDING_UNREGISTER';
  const showCaptcha =
    !submitting &&
    !registrationPending &&
    !registration &&
    captchaOpen &&
    event.useCaptcha;
  const showStripe =
    event.useStripe &&
    event.isPriced &&
    event.price > 0 &&
    registration &&
    registration.pool &&
    ![paymentManual, paymentSuccess].includes(registration.paymentStatus);
  const [registrationPendingDelayed, setRegistrationPendingDelayed] =
    useState(false);
  const eventSemester = getEventSemesterFromStartTime(event.startTime);
  const hasRegisteredConsentForSemester = allConsentsAnswered(
    event.photoConsents
  );
  const hasRegisteredConsentIfRequired = event.useConsent
    ? hasRegisteredConsentForSemester
    : true;
  useEffect(() => {
    const timer = setTimeout(
      () => setRegistrationPendingDelayed(registrationPending),
      registrationPendingDelayed && !registrationPending ? 0 : 1000
    );
    return () => clearTimeout(timer);
  }, [registrationPending, registrationPendingDelayed]);
  const [showStripeDelayed, setShowStripeDelayed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowStripeDelayed(showStripe), 2000);
    return () => clearTimeout(timer);
  }, [showStripe]);

  if (registrationIsClosed(event)) {
    return (
      <>
        {!formOpen && registration && showStripe && (
          <PaymentForm
            createPaymentIntent={createPaymentIntent}
            event={event}
            currentUser={currentUser}
            registration={registration}
          />
        )}
      </>
    );
  }

  const registrationMessage = (event) => {
    switch (event.eventStatusType) {
      case 'OPEN':
        return <div>Dette arrangementet krever ingen påmelding</div>;

      case 'TBA':
        return (
          <div>Påmelding til dette arrangementet er ikke bestemt enda</div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <h3 className={styles.subHeader}>Påmelding</h3>
      <Flex column>
        {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
          registrationMessage(event)
        ) : (
          <>
            {!formOpen && event.activationTime && (
              <div>
                {moment(event.activationTime) < moment() ? 'Åpnet ' : 'Åpner '}
                <Time time={event.activationTime} format="nowToTimeInWords" />
              </div>
            )}
            {disabledForUser && (
              <div>Du kan ikke melde deg på dette arrangementet.</div>
            )}
            {sumPenalties(penalties) > 0 && event.heedPenalties && (
              <Card severity="warning">
                <Card.Header>NB!</Card.Header>
                <p>
                  {sumPenalties(penalties) > 2
                    ? `Du blir lagt rett på venteliste hvis du melder deg på`
                    : `Påmeldingen din er forskjøvet
                      ${penaltyHours(penalties)} timer`}{' '}
                  fordi du har {sumPenalties(penalties)}{' '}
                  {sumPenalties(penalties) > 1 ? 'prikker' : 'prikk'}.
                </p>
                <Link to="/pages/arrangementer/26-arrangementsregler">
                  Les mer om prikker her
                </Link>
              </Card>
            )}
            {!disabledForUser &&
              event.useContactTracing &&
              !currentUser.phoneNumber && (
                <Card severity="danger">
                  <Card.Header>NB!</Card.Header>
                  <p>
                    Du må legge til telefonnummer for å melde deg på dette
                    arrangementet.
                  </p>
                  <Link to={`/users/me/settings/profile`}>
                    Gå til innstillinger
                  </Link>
                </Card>
              )}
            {!disabledForUser &&
              event.useConsent &&
              !hasRegisteredConsentForSemester && (
                <Card severity="danger">
                  <Card.Header>NB!</Card.Header>
                  <p>
                    Du må ta stilling til bildesamtykke for semesteret{' '}
                    {toReadableSemester(eventSemester)} for å melde deg på dette
                    arrangement.
                  </p>
                  <Link to={`/users/me/`}>Gå til min profil</Link>
                </Card>
              )}
            {formOpen &&
              hasRegisteredConsentIfRequired &&
              (event.useContactTracing ? currentUser.phoneNumber : true) && (
                <Flex column>
                  <Form
                    onSubmit={submitWithType(
                      handleSubmit,
                      feedbackName,
                      registrationType
                    )}
                  >
                    {showCaptcha && (
                      <Field
                        name="captchaResponse"
                        fieldStyle={{
                          width: 304,
                        }}
                        component={Captcha.Field}
                      />
                    )}
                    {event.activationTime && registrationOpensIn && (
                      <Flex alignItems="center">
                        <Button disabled={disabledButton}>
                          {`Åpner om ${registrationOpensIn}`}
                        </Button>
                      </Flex>
                    )}
                    {buttonOpen && !submitting && !registrationPending && (
                      <>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <SubmitButton
                            disabled={disabledButton}
                            onSubmit={submitWithType(
                              handleSubmit,
                              feedbackName,
                              registrationType
                            )}
                            type={registrationType}
                            title={title || joinTitle}
                            showPenaltyNotice={showPenaltyNotice}
                          />
                        </Flex>
                        {!registration && (
                          <SpotsLeft
                            activeCapacity={event.activeCapacity}
                            spotsLeft={event.spotsLeft}
                          />
                        )}
                      </>
                    )}
                    {submitting ||
                      (registrationPending && !registrationPendingDelayed && (
                        <LoadingIndicator
                          loading
                          loadingStyle={{
                            margin: '5px auto',
                          }}
                        />
                      ))}
                    {registrationPendingDelayed && (
                      <RegistrationPending
                        reg_status={pendingRegistration?.status}
                      />
                    )}
                  </Form>

                  <Flex alignItems="center" gap={10}>
                    <Field
                      id={feedbackName}
                      placeholder="Melding til arrangør"
                      name={feedbackName}
                      component={TextInput.Field}
                      label={feedbackLabel}
                      className={styles.feedbackText}
                      rows={1}
                    />
                    {registration && (
                      <Button
                        type="button"
                        onClick={submitWithType(
                          handleSubmit,
                          feedbackName,
                          'feedback'
                        )}
                        disabled={pristine}
                      >
                        Oppdater
                      </Button>
                    )}
                  </Flex>

                  {registration && showStripeDelayed && (
                    <PaymentForm
                      event={event}
                      createPaymentIntent={createPaymentIntent}
                      currentUser={currentUser}
                      registration={registration}
                    />
                  )}
                </Flex>
              )}
          </>
        )}
      </Flex>
    </>
  );
};

function getFeedbackName(event: Event): string {
  return event.feedbackRequired ? 'feedbackRequired' : 'feedback';
}

function getFeedbackLabel(event: Event): string {
  return event.feedbackDescription || 'Melding til arrangør';
}

function validateEventForm(data, props) {
  const errors = {};

  if (!props.registration && !data.feedbackRequired) {
    errors.feedbackRequired = 'Svar er påkrevet for dette arrangementet';
  }

  if (!data.captchaResponse) {
    errors.captchaResponse = 'Captcha er ikke validert';
  }

  return errors;
}

function mapStateToProps(state, { event, registration }) {
  if (registration) {
    const feedbackName = getFeedbackName(event);
    return {
      initialValues: {
        [feedbackName]: registration.feedback,
      },
    };
  }

  const user = state.auth
    ? selectUserByUsername(state, {
        username: state.auth.username,
      })
    : null;
  const penalties = user
    ? selectPenaltyByUserId(state, {
        userId: user.id,
      })
    : [];
  return {
    penalties,
  };
}

export default compose(
  connect(mapStateToProps, null),
  withCountdown,
  reduxForm({
    form: 'joinEvent',
    onChange: (values = {}, dispatch, props, previousValues = {}) => {
      if (values.captchaResponse !== previousValues.captchaResponse) {
        // Trigger form validation for required feedback when captcha is changd
        props.touch('feedbackRequired');
      }
    },
    validate: validateEventForm,
  })
)(JoinEventForm);
