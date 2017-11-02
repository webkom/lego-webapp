// @flow

import styles from './Event.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import moment from 'moment-timezone';
import { Form, Captcha, TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';
import UpdateAllergies from './UpdateAllergies';
import StripeCheckout from 'react-stripe-checkout';
import Icon from 'app/components/Icon';
import logoImage from 'app/assets/kule.png';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Time from 'app/components/Time';
import { Flex } from 'app/components/Layout';
import config from 'app/config';
import CountdownProvider, {
  getTimeUntil
} from './JoinEventFormCountdownProvider';

type Event = Object;

export type Props = {
  title?: string,
  event: Event,
  registration: Object,
  currentUser: Object,
  onSubmit: Object => void,
  onToken: () => void,

  updateUser: () => void,
  handleSubmit: /*TODO: SubmitHandler<>*/ any => void,

  /*TODO: & ReduxFormProps */
  invalid: boolean,
  pristine: boolean,
  submitting: boolean
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
      submitting
    } = this.props;

    const registrationOpensIn = event.activationTime
      ? moment(getTimeUntil(event.activationTime))
      : null;

    const isInvalid = registrationOpensIn !== null || invalid;
    const isPristine = event.feedbackRequired && pristine;
    const disabledButton = !registration
      ? isInvalid || isPristine || submitting
      : null;

    const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
    const registrationType = !registration ? 'register' : 'unregister';

    const feedbackName = getFeedbackName(event);
    const feedbackLabel = getFeedbackLabel(event);

    const showStripe =
      event.isPriced &&
      event.price > 0 &&
      registration &&
      registration.pool &&
      !['pending', 'succeeded'].includes(registration.chargeStatus);

    return (
      <CountdownProvider
        event={event}
        registration={registration}
        render={({ buttonOpen, formOpen, captchaOpen }) => (
          <Flex column className={styles.join}>
            <div className={styles.joinHeader}>
              Bli med på dette arrangementet
            </div>
            <Link
              to="/pages/info/26-arrangementsregler"
              style={{ marginTop: 0 }}
            >
              <Flex alignItems="center">
                <Icon name="document" style={{ marginRight: '4px' }} />
                <span>Regler for Abakus&#39; arrangementer</span>
              </Flex>
            </Link>

            {!formOpen &&
              event.activationTime && (
                <div>
                  Åpner{' '}
                  <Time time={event.activationTime} format="nowToTimeInWords" />
                </div>
              )}

            {!formOpen &&
              !registration &&
              !event.activationTime && (
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
                  <Field
                    label={feedbackLabel}
                    placeholder="Melding til arrangører"
                    name={feedbackName}
                    component={TextEditor.Field}
                  />
                  {registration && (
                    <div>
                      <Button
                        type="button"
                        onClick={this.submitWithType(
                          handleSubmit,
                          feedbackName,
                          'feedback'
                        )}
                        style={{ marginBottom: '5px' }}
                        disabled={pristine}
                      >
                        Oppdater feedback
                      </Button>
                    </div>
                  )}
                  {!submitting &&
                    !registration &&
                    captchaOpen &&
                    event.useCaptcha && (
                      <Field
                        name="captchaResponse"
                        fieldStyle={{ width: 304 }}
                        component={Captcha.Field}
                      />
                    )}
                  {event.activationTime &&
                    registrationOpensIn && (
                      <Flex alignItems="center">
                        <Button disabled={disabledButton}>
                          {`Åpner om ${registrationOpensIn.format('mm:ss')}`}
                        </Button>
                      </Flex>
                    )}
                  {buttonOpen &&
                    !submitting && (
                      <Flex alignItems="center">
                        <Button
                          style={{ marginRight: 10 }}
                          submit
                          disabled={disabledButton}
                        >
                          {title || joinTitle}
                        </Button>

                        {!registration && (
                          <div>{getSpotsLeftMessage(event)}</div>
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

            {showStripe && (
              <StripeCheckout
                name="Abakus Linjeforening"
                description={event.title}
                image={logoImage}
                currency="NOK"
                allowRememberMe={false}
                locale="no"
                token={onToken}
                stripeKey={config.stripeKey}
                amount={event.price}
                email={currentUser.email}
              >
                <Button>Betal nå</Button>
              </StripeCheckout>
            )}
          </Flex>
        )}
      />
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

function getSpotsLeftMessage(event: Event) {
  if (event.spotsLeft === 1) {
    return 'Det er 1 plass igjen';
  }

  if (event.spotsLeft === 0 && event.activeCapacity > 0) {
    return 'Det 0 plasser igjen, du blir registrert til venteliste.';
  }

  return `Det er ${event.spotsLeft} plasser igjen`;
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

function mapStateToProps(state, props) {
  if (props.registration) {
    const feedbackName = getFeedbackName(props.event.feedbackRequired);
    return {
      initialValues: {
        [feedbackName]: props.registration.feedback
      }
    };
  }
  return {};
}

export default compose(
  // $FlowFixMe
  connect(mapStateToProps, null),
  reduxForm({
    form: 'joinEvent',
    validate: validateEventForm
  })
)(JoinEventForm);
