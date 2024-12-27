import {
  Button,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  ProgressBar,
  Skeleton,
} from '@webkom/lego-bricks';
import { sumBy } from 'lodash';
import { CircleHelp, UserMinus } from 'lucide-react';
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
import Tooltip from 'app/components/Tooltip';
import config from 'app/config';
import { useCurrentUser } from 'app/reducers/auth';
import { selectRegistrationForEventByUserId } from 'app/reducers/events';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { useRegistrationCountdown } from 'app/routes/events/components/useRegistrationCountdown';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Presence } from 'app/store/models/Registration';
import { Keyboard } from 'app/utils/constants';
import { spyValues } from 'app/utils/formSpyUtils';
import { createValidator, requiredIf } from 'app/utils/validation';
import {
  paymentSuccess,
  paymentManual,
  penaltyHours,
  getEventSemesterFromStartTime,
  allConsentsAnswered,
  toReadableSemester,
  registrationActionUnavailable,
} from '../utils';
import styles from './Event.module.css';
import PaymentRequestForm from './StripeElement';
import type { EventRegistrationStatus } from 'app/models';
import type { PoolRegistrationWithUser } from 'app/reducers/events';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { CurrentUser } from 'app/store/models/User';

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
      <Button submit onPress={onSubmit} disabled={disabled}>
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
      closeOnConfirm
    >
      {({ openConfirmModal }) => (
        <Button danger onPress={openConfirmModal} disabled={disabled}>
          <Icon iconNode={<UserMinus />} size={19} />
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
  <Card severity="info">
    <Card.Header>
      Vi behandler din{' '}
      {reg_status === 'PENDING_UNREGISTER' ? 'avregistrering' : 'registrering'}
    </Card.Header>
    <span>
      Det kan ta et øyeblikk eller to, og du trenger ikke refreshe siden
      <Tooltip
        className={styles.registrationPendingTooltip}
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
        <Icon iconNode={<CircleHelp />} size={18} />
      </Tooltip>
    </span>
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
  registration: PoolRegistrationWithUser;
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
      paymentStatus={registration.paymentStatus ?? null}
      clientSecret={registration.clientSecret}
    />
  </div>
);

type FormValues = {
  feedback?: string;
  captchaResponse: string;
};
const TypedLegoForm = LegoFinalForm<FormValues>;

export type Props = {
  title?: string;
  event: UserDetailedEvent | AuthUserDetailedEvent;
  registration?: PoolRegistrationWithUser;
  registrationPending?: boolean;
  fiveMinutesBeforeActivation?: boolean;
};

const JoinEventForm = ({
  title,
  event,
  registration,
  fiveMinutesBeforeActivation = false,
}: Props) => {
  const { buttonOpen, formOpen, captchaOpen, registrationOpensIn } =
    useRegistrationCountdown(event, registration);

  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const pendingRegistration = useAppSelector((state) =>
    selectRegistrationForEventByUserId(state, {
      eventId: event.id,
      userId: currentUser?.id,
    }),
  );

  const fetching = useAppSelector((state) => state.events.fetching);

  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, currentUser?.id),
  );
  const sumPenalties = sumBy(penalties, 'weight');

  const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
  const registrationType = !registration ? 'register' : 'unregister';
  const disabledForUser =
    !fetching && !formOpen && !event.activationTime && !registration;
  const showPenaltyNotice = Boolean(
    event.heedPenalties &&
      moment().isAfter(event.unregistrationDeadline) &&
      registration &&
      registration.pool,
  );
  const registrationPending =
    pendingRegistration?.status === 'PENDING_REGISTER' ||
    pendingRegistration?.status === 'PENDING_UNREGISTER';
  const showStripe: boolean =
    event.useStripe &&
    event.isPriced &&
    event.price > 0 &&
    !!registration &&
    !!(registration.pool || registration.presence === Presence.PRESENT) &&
    'paymentStatus' in registration &&
    ![paymentManual, paymentSuccess].includes(registration.paymentStatus ?? '');
  const [registrationPendingDelayed, setRegistrationPendingDelayed] =
    useState(false);
  const eventSemester = getEventSemesterFromStartTime(event.startTime);
  const hasRegisteredConsentForSemester = allConsentsAnswered(
    event.photoConsents,
  );
  const hasRegisteredConsentIfRequired = event.useConsent
    ? hasRegisteredConsentForSemester
    : true;
  useEffect(() => {
    const timer = setTimeout(
      () => setRegistrationPendingDelayed(registrationPending),
      registrationPendingDelayed && !registrationPending ? 0 : 1000,
    );
    return () => clearTimeout(timer);
  }, [registrationPending, registrationPendingDelayed]);
  const [showStripeDelayed, setShowStripeDelayed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowStripeDelayed(showStripe), 2000);
    return () => clearTimeout(timer);
  }, [showStripe]);

  if (!currentUser) {
    return null;
  }

  const onSubmit = (values: FormValues) => {
    if (registrationType === 'unregister') {
      return (
        registration &&
        dispatch(
          unregister({
            eventId: event.id,
            registrationId: registration.id,
          }),
        )
      );
    }

    return dispatch(
      register({
        eventId: event.id,
        captchaResponse: values.captchaResponse,
        feedback: values.feedback ?? '',
        userId: currentUser.id,
      }),
    );
  };

  if (registrationActionUnavailable(event, registration)) {
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
    feedback: [
      requiredIf(
        () => !registration && event.feedbackRequired,
        'Svar er påkrevd for dette arrangementet',
      ),
    ],
    captchaResponse: [
      requiredIf(() => !registration, 'Captcha er ikke validert'),
    ],
  });

  const initialValues: Partial<FormValues> = registration
    ? { feedback: registration.feedback }
    : {};

  return (
    <div>
      <h3>Påmelding</h3>

      <Flex column gap="var(--spacing-md)">
        {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
          registrationMessage(event)
        ) : (
          <>
            {!event?.activationTime && fetching && (
              <Skeleton array={2} height={35} />
            )}

            {!formOpen && event.activationTime && (
              <div>
                Åpner om{' '}
                <time dateTime={moment(event.activationTime).format()}>
                  {registrationOpensIn?.humanize()}
                </time>
              </div>
            )}

            {disabledForUser && (
              <div>Du kan ikke melde deg på dette arrangementet</div>
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
              <Flex column gap="var(--spacing-md)">
                <TypedLegoForm
                  onSubmit={onSubmit}
                  validate={validate}
                  initialValues={initialValues}
                >
                  {({ form, handleSubmit, submitting, pristine, invalid }) => {
                    if (event.feedbackRequired) {
                      form.blur('feedback');
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
                      config.environment !== 'ci' &&
                      event.useCaptcha;

                    return (
                      <Form className={styles.form}>
                        {showCaptcha && (
                          <Field
                            name="captchaResponse"
                            fieldStyle={{
                              width: '100%',
                            }}
                            component={Captcha.Field}
                            withoutMargin
                          />
                        )}

                        {event.activationTime &&
                          registrationOpensIn &&
                          !registration && (
                            <Button disabled={disabledButton}>
                              {`Åpner om ${moment(registrationOpensIn.add(1, 'second').asMilliseconds()).format('mm:ss')}`}
                            </Button>
                          )}

                        {buttonOpen && !submitting && !registrationPending && (
                          <>
                            <SubmitButton
                              disabled={disabledButton}
                              onSubmit={handleSubmit}
                              type={registrationType}
                              title={title || joinTitle}
                              showPenaltyNotice={showPenaltyNotice}
                            />

                            <SubmissionError />
                          </>
                        )}

                        {!registration && fiveMinutesBeforeActivation && (
                          <div>
                            Ved å melde deg på arrangementet samtykker du til{' '}
                            <Link to="/pages/arrangementer/26-arrangementsregler">
                              arrangementsreglene
                            </Link>
                          </div>
                        )}

                        {submitting ||
                          (registrationPending &&
                            !registrationPendingDelayed && (
                              <LoadingIndicator
                                loading
                                loadingStyle={{
                                  margin: 'var(--spacing-sm) auto',
                                }}
                              />
                            ))}

                        {registrationPendingDelayed && (
                          <RegistrationPending
                            reg_status={pendingRegistration?.status}
                          />
                        )}

                        {(event.feedbackRequired ||
                          (event.feedbackDescription &&
                            event.feedbackDescription !== '')) && (
                          <div>
                            <label
                              htmlFor="feedback"
                              className={styles.feedbackLabel}
                            >
                              {event.feedbackDescription}
                            </label>
                            <Flex alignItems="center" gap="var(--spacing-md)">
                              {spyValues((values: FormValues) => (
                                <Field
                                  id="feedback"
                                  name="feedback"
                                  placeholder="Kommentar"
                                  component={TextInput.Field}
                                  className={styles.feedbackText}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === Keyboard.ENTER &&
                                      registration
                                    ) {
                                      // Prevent user from unregistering by pressing enter
                                      e.preventDefault();

                                      if (!pristine) {
                                        dispatch(
                                          updateFeedback(
                                            event.id,
                                            registration.id,
                                            values.feedback ?? '',
                                          ),
                                        );
                                      }
                                    }
                                  }}
                                  withoutMargin
                                  parse={(value) => value} // Prevent react-final-form from removing empty string in patch request
                                />
                              ))}
                              {registration &&
                                spyValues((values: FormValues) => (
                                  <Button
                                    onPress={() => {
                                      dispatch(
                                        updateFeedback(
                                          event.id,
                                          registration.id,
                                          values.feedback ?? '',
                                        ),
                                      );
                                    }}
                                    disabled={pristine}
                                  >
                                    Oppdater
                                  </Button>
                                ))}
                            </Flex>
                          </div>
                        )}
                      </Form>
                    );
                  }}
                </TypedLegoForm>

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
    </div>
  );
};

export default JoinEventForm;
