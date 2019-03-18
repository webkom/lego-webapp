// @flow

import styles from './Event.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Captcha, TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';
import UpdateAllergies from './UpdateAllergies';
import PaymentRequestForm from './StripeElement';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Time from 'app/components/Time';
import { Flex } from 'app/components/Layout';
import withCountdown from './JoinEventFormCountdownProvider';
import formStyles from 'app/components/Form/Field.css';
import moment from 'moment-timezone';
import { paymentPending, paymentSuccess, paymentManual } from '../utils';

type Event = Object;

export type Props = {
  title?: string,
  event: Event,
  registration: ?Object,
  currentUser: Object,
  onSubmit: Object => void,
  onToken: () => Promise<*>,

  updateUser: () => void,
  handleSubmit: /*TODO: SubmitHandler<>*/ any => void,

  /*TODO: & ReduxFormProps */
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  formOpen: boolean,
  captchaOpen: boolean,
  buttonOpen: boolean,
  registrationOpensIn: ?string,
  touch: (field: string) => void
};

type SpotsLeftProps = {
  activeCapacity: number,
  spotsLeft: number
};
const SubmitButton = ({
  onSubmit,
  disabled,
  type,
  title,
  showPenaltyNotice
}: {
  onSubmit?: () => void,
  disabled: boolean,
  type: string,
  title: string,
  showPenaltyNotice: boolean
}) => {
  if (type === 'register') {
    return (
      <Button
        style={{ marginRight: 10 }}
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
    <ConfirmModalWithParent
      title="Avregistrer"
      message={message}
      onConfirm={() => {
        onSubmit && onSubmit();
        return Promise.resolve();
      }}
    >
      <Button style={{ marginRight: 10 }} dark disabled={disabled}>
        {title}
      </Button>
    </ConfirmModalWithParent>
  );
};

const SpotsLeft = ({ activeCapacity, spotsLeft }: SpotsLeftProps) => {
  if (spotsLeft === 1) {
    return <div>Det er 1 plass igjen.</div>;
  }

  if (spotsLeft === 0 && activeCapacity > 0) {
    return <div>Det 0 plasser igjen, du blir registrert til venteliste.</div>;
  }

  return <div>Det er {spotsLeft} plasser igjen.</div>;
};
class JoinEventForm extends Component<Props> {
  submitWithType = (handleSubmit, feedbackName, type) => {
    if (type === 'unregister') {
      return handleSubmit(() =>
        this.props.onSubmit({
          type
        })
      );
    }

    return handleSubmit(values => {
      const feedback = values[feedbackName];
      if (this.props.event.feedbackRequired && !feedback) {
        throw new SubmissionError({
          feedbackRequired: 'Tilbakemelding er påkrevet for dette arrangementet'
        });
      }

      return this.props.onSubmit({
        captchaResponse: values.captchaResponse,
        feedback,
        type
      });
    });
  };

  render() {
    const {
      title,
      event,
      registration,
      currentUser,
      updateUser,
      handleSubmit,
      onToken,
      invalid,
      pristine,
      submitting,
      buttonOpen,
      formOpen,
      captchaOpen,
      registrationOpensIn
    } = this.props;

    const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
    const registrationType = !registration ? 'register' : 'unregister';

    const feedbackName = getFeedbackName(event);
    const feedbackLabel = getFeedbackLabel(event);

    const isInvalid = registrationOpensIn !== null || invalid;
    const isPristine = event.feedbackRequired && pristine;
    const disabledButton = !registration
      ? isInvalid || isPristine || submitting
      : false;
    const disabledForUser = !formOpen && !event.activationTime;
    const showPenaltyNotice = Boolean(
      event.heedPenalties &&
        moment().isAfter(event.unregistrationDeadline) &&
        registration &&
        registration.pool
    );
    const showCaptcha =
      !submitting && !registration && captchaOpen && event.useCaptcha;
    const showStripe =
      event.isPriced &&
      event.price > 0 &&
      registration &&
      registration.pool &&
      ![paymentPending, paymentManual, paymentSuccess].includes(
        registration.chargeStatus
      );

    return (
      <Flex column className={styles.join}>
        {!formOpen && event.activationTime && (
          <div>
            {new Date(event.activationTime) < new Date() ? 'Åpnet ' : 'Åpner '}
            <Time time={event.activationTime} format="nowToTimeInWords" />
          </div>
        )}
        {disabledForUser && (
          <div>Du kan ikke melde deg på dette arrangementet.</div>
        )}
        {formOpen && (
          <Flex column>
            <UpdateAllergies
              username={currentUser.username}
              initialValues={{ allergies: currentUser.allergies }}
              updateUser={updateUser}
            />
            <Form
              onSubmit={this.submitWithType(
                handleSubmit,
                feedbackName,
                registrationType
              )}
            >
              <label className={formStyles.label} htmlFor={feedbackName}>
                {feedbackLabel}
              </label>
              <Flex style={{ marginBottom: '20px' }}>
                <Field
                  id={feedbackName}
                  placeholder="Melding til arrangører"
                  name={feedbackName}
                  component={TextEditor.Field}
                  labelClassName={styles.feedbackLabel}
                  className={styles.feedbackText}
                  fieldClassName={styles.feedbackField}
                  rows={1}
                />
                {registration && (
                  <Button
                    type="button"
                    onClick={this.submitWithType(
                      handleSubmit,
                      feedbackName,
                      'feedback'
                    )}
                    className={styles.feedbackUpdateButton}
                    disabled={pristine}
                  >
                    Oppdater
                  </Button>
                )}
              </Flex>
              {showCaptcha && (
                <Field
                  name="captchaResponse"
                  fieldStyle={{ width: 304 }}
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
              {buttonOpen && !submitting && (
                <Flex alignItems="center">
                  <SubmitButton
                    disabled={disabledButton}
                    onSubmit={this.submitWithType(
                      handleSubmit,
                      feedbackName,
                      registrationType
                    )}
                    type={registrationType}
                    title={title || joinTitle}
                    showPenaltyNotice={showPenaltyNotice}
                  />

                  {!registration && (
                    <SpotsLeft
                      activeCapacity={event.activeCapacity}
                      spotsLeft={event.spotsLeft}
                    />
                  )}
                  {showStripe && (
                    <PaymentRequestForm
                      onToken={onToken}
                      event={event}
                      currentUser={currentUser}
                    />
                  )}
                </Flex>
              )}
              {submitting && (
                <LoadingIndicator
                  loading
                  loadingStyle={{ margin: '5px auto' }}
                />
              )}
            </Form>
          </Flex>
        )}
      </Flex>
    );
  }
}

function getFeedbackName(event: Event) {
  return event.feedbackRequired ? 'feedbackRequired' : 'feedback';
}

function getFeedbackLabel(event: Event) {
  const feedbackLabel = event.feedbackRequired
    ? 'NB: Dette arrangementet krever tilbakemelding'
    : 'Tilbakemelding';

  return event.feedbackDescription
    ? `${feedbackLabel}: ${event.feedbackDescription}`
    : feedbackLabel;
}

function validateEventForm(data, props) {
  const errors = {};

  if (!props.registration && !data.feedbackRequired) {
    errors.feedbackRequired =
      'Tilbakemelding er påkrevet for dette arrangementet';
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
        [feedbackName]: registration.feedback
      }
    };
  }
  return {};
}

export default compose(
  // $FlowFixMe
  connect(
    mapStateToProps,
    null
  ),
  withCountdown,
  reduxForm({
    form: 'joinEvent',
    onChange: (values = {}, dispatch, props, previousValues = {}) => {
      if (values.captchaResponse !== previousValues.captchaResponse) {
        // Trigger form validation for required feedback when captcha is changd
        props.touch('feedbackRequired');
      }
    },
    validate: validateEventForm
  })
)(JoinEventForm);
