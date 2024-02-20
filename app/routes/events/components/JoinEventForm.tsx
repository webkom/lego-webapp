import {
  Button,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  ProgressBar,
} from '@webkom/lego-bricks';
import { sumBy } from 'lodash';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { register, unregister, updateFeedback } from 'app/actions/EventActions';
import {
  Form,
  Captcha,
  TextInput,
  SubmissionError,
  LegoFinalForm,
} from 'app/components/Form';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { spyValues } from 'app/utils/formSpyUtils';
import { createValidator, requiredIf } from 'app/utils/validation';
import {
  paymentSuccess,
  paymentManual,
  penaltyHours,
  registrationIsClosed,
  getEventSemesterFromStartTime,
  allConsentsAnswered,
  toReadableSemester,
} from '../utils';
import styles from './Event.css';
import withCountdown from './JoinEventFormCountdownProvider';
import PaymentRequestForm from './StripeElement';
import type { EventRegistration, EventRegistrationStatus } from 'app/models';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type Penalty from 'app/store/models/Penalty';
import type { CurrentUser } from 'app/store/models/User';

type SpotsLeftProps = {
  activeCapacity: number;
  spotsLeft: number;
};

/**
 *  Not using app/components/SubmitButton because that will "falsely"
 *  be disabled when the form is pristine, which it often is.
 */
const SubmitButton = ({
  onSubmit,
  disabled,
  type,
  title,
  showPenaltyNotice,
}: {
  onSubmit?: () => void;
  disabled: boolean;
  type: 'register' | 'unregister';
  title: string;
  showPenaltyNotice: boolean;
}) => {
  if (type === 'register') {
    return (
      <Button
        submit
        onClick={onSubmit}
        className={styles.registrationBtn}
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
      onConfirm={onSubmit}
      // onConfirm={() => {
      //   if (onSubmit) {
      //     onSubmit();
      //   }
      // }}
      closeOnConfirm
    >
      {({ openConfirmModal }) => (
        <Button
          danger
          onClick={openConfirmModal}
          className={styles.registrationBtn}
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
  event,
  currentUser,
  registration,
}: {
  event: AuthUserDetailedEvent | UserDetailedEvent;
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
        Det er ingen plasser igjen, og du vil bli registrert til venteliste
      </div>
    );
  }

  const word = spotsLeft > 1 ? 'plasser' : 'plass';
  return (
    <div>
      Det er {spotsLeft} {word} igjen
    </div>
  );
};

export type Props = {
  title?: string;
  event: UserDetailedEvent | AuthUserDetailedEvent;
  registration: EventRegistration | null | undefined;
  pendingRegistration: EventRegistration | null | undefined;
  registrationPending: boolean;
  formOpen: boolean;
  captchaOpen: boolean;
  buttonOpen: boolean;
  registrationOpensIn: string | null | undefined;
};

const JoinEventForm = ({
  title,
  event,
  registration,
  pendingRegistration,
  buttonOpen,
  formOpen,
  captchaOpen,
  registrationOpensIn,
}: Props) => {
  const { currentUser } = useUserContext();

  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, {
      userId: currentUser?.id,
    })
  ) as Penalty[];
  const sumPenalties = sumBy(penalties, 'weight');

  const dispatch = useAppDispatch();

  const onSubmit = (values) => {
    if (registrationType === 'unregister') {
      return (
        registration &&
        dispatch(
          unregister({
            eventId: event.id,
            registrationId: registration.id,
          })
        )
      );
    }

    return dispatch(
      register({
        eventId: event.id,
        captchaResponse: values.captchaResponse,
        feedback: values[feedbackName],
        userId: currentUser.id,
      })
    );
  };

  const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
  const registrationType = !registration ? 'register' : 'unregister';
  const feedbackName = getFeedbackName(event);
  const feedbackLabel = getFeedbackLabel(event);
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

  const validate = createValidator({
    [feedbackName]: [
      requiredIf(
        () => !registration && event.feedbackRequired,
        'Svar er påkrevd for dette arrangementet'
      ),
    ],
    captchaResponse: [
      requiredIf(() => !registration, 'Captcha er ikke validert'),
    ],
  });

  const initialValues = registration
    ? { [feedbackName]: registration.feedback }
    : {};

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
            {sumPenalties > 0 && event.heedPenalties && (
              <Card severity="warning">
                <Card.Header>NB!</Card.Header>
                <p>
                  {sumPenalties > 2
                    ? `Du blir lagt rett på venteliste hvis du melder deg på`
                    : `Påmeldingen din er forskjøvet
                      ${penaltyHours(penalties)} timer`}{' '}
                  fordi du har {sumPenalties}{' '}
                  {sumPenalties > 1 ? 'prikker' : 'prikk'}.
                </p>
                <Link to="/pages/arrangementer/26-arrangementsregler">
                  Les mer om prikker her
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
                  <Link to="/users/me/">Gå til min profil</Link>
                </Card>
              )}
            {formOpen && hasRegisteredConsentIfRequired && (
              <Flex column>
                <LegoFinalForm
                  onSubmit={onSubmit}
                  validate={validate}
                  initialValues={initialValues}
                >
                  {({ form, handleSubmit, submitting, pristine, invalid }) => {
                    if (event.feedbackRequired) {
                      form.blur('feedbackRequired');
                    }

                    const isInvalid = registrationOpensIn !== null || invalid;
                    const isPristine = event.feedbackRequired && pristine;
                    const disabledButton = !registration
                      ? isInvalid || isPristine || submitting
                      : false;
                    const showCaptcha =
                      !submitting &&
                      !registrationPending &&
                      !registration &&
                      captchaOpen &&
                      event.useCaptcha;

                    return (
                      <Form onSubmit={handleSubmit}>
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
                                onSubmit={handleSubmit}
                                type={registrationType}
                                title={title || joinTitle}
                                showPenaltyNotice={showPenaltyNotice}
                              />
                            </Flex>

                            <SubmissionError />

                            {!registration && event.activeCapacity && (
                              <SpotsLeft
                                activeCapacity={event.activeCapacity}
                                spotsLeft={event.spotsLeft}
                              />
                            )}
                          </>
                        )}

                        {submitting ||
                          (registrationPending &&
                            !registrationPendingDelayed && (
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

                        <Flex
                          alignItems="center"
                          gap={10}
                          className={styles.feedback}
                        >
                          <Field
                            id={feedbackName}
                            placeholder="Melding til arrangør"
                            name={feedbackName}
                            component={TextInput.Field}
                            label={feedbackLabel}
                            className={styles.feedbackText}
                            parse={(value) => value} // Prevent react-final-form from removing empty string in patch request
                            rows={1}
                          />
                          {registration &&
                            spyValues((values) => (
                              <Button
                                type="button"
                                onClick={() => {
                                  dispatch(
                                    updateFeedback(
                                      event.id,
                                      registration.id,
                                      values[feedbackName]
                                    )
                                  );
                                }}
                                disabled={pristine}
                              >
                                Oppdater
                              </Button>
                            ))}
                        </Flex>
                      </Form>
                    );
                  }}
                </LegoFinalForm>

                {registration && showStripeDelayed && (
                  <PaymentForm
                    event={event}
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

function getFeedbackName(event: UserDetailedEvent) {
  return event.feedbackRequired ? 'feedbackRequired' : 'feedback';
}

function getFeedbackLabel(event: UserDetailedEvent) {
  return event.feedbackDescription || 'Melding til arrangør';
}

export default withCountdown(JoinEventForm);
