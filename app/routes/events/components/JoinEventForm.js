// @flow

import styles from './Event.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import moment from 'moment';
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

export type Props = {
  title: string,
  event: Event,
  registration: Object,
  currentUser: Object,
  onSubmit: void,
  onToken: void
};

class JoinEventForm extends Component {
  state = {
    time: null,
    formOpen: false,
    captchaOpen: false,
    buttonOpen: false
  };
  counter = undefined;

  componentDidMount() {
    this.parseEventTimes(this.props.event, this.props.registration);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.event.activationTime && !this.props.event.activationTime) ||
      nextProps.registration !== this.props.registration
    ) {
      this.setState({ formOpen: false });
      this.parseEventTimes(nextProps.event, nextProps.registration);
    }
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  parseEventTimes = ({ activationTime, startTime }, registration) => {
    const poolActivationTime = moment(activationTime);
    const currentTime = moment();
    const diffTime = poolActivationTime.diff(currentTime);
    let duration = moment.duration(diffTime, 'milliseconds');
    if (
      (!registration && !activationTime) ||
      currentTime.isAfter(moment(startTime).subtract(2, 'hours'))
    ) {
      // Do nothing
      // TODO: the 2 hour subtract is a hardcoded close time and should be improved
    } else if (poolActivationTime.isBefore(currentTime) || registration) {
      this.setState({
        formOpen: true,
        captchaOpen: true,
        buttonOpen: true
      });
    } else if (poolActivationTime.day() > currentTime.day()) {
      this.setState({
        time: poolActivationTime
      });
    } else if (duration.asMinutes() > 10) {
      this.setState({
        time: poolActivationTime
      });
      const interval = 10000;
      this.counter = setInterval(() => {
        const diff = duration - interval;
        duration = moment.duration(diff, 'milliseconds');
        if (diff < 600000) {
          clearInterval(this.counter);
          this.initiateCountdown(duration);
        }
      }, interval);
    } else {
      this.initiateCountdown(duration);
    }
  };

  initiateCountdown(duration) {
    const interval = 1000;
    duration += 1000;
    this.counter = setInterval(() => {
      duration = moment.duration(duration, 'milliseconds') - interval;
      if (duration <= 1000) {
        clearInterval(this.counter);
        this.setState({
          time: null,
          buttonOpen: true
        });
        return;
      }
      if (duration < 60000) {
        this.setState({
          captchaOpen: true
        });
      }
      this.setState({
        time: moment(duration).format('mm:ss')
      });
    }, interval);
    this.setState({
      formOpen: true
    });
  }

  submitWithType = (handleSubmit, feedbackName, type = null) => {
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

    const isInvalid = this.state.time !== null || invalid;
    const isPristine = event.feedbackRequired && pristine;
    const disabledButton = !registration
      ? isInvalid || isPristine || submitting
      : null;
    const joinTitle = !registration ? 'Meld deg på' : 'Avregistrer';
    const registrationType = !registration ? 'register' : 'unregister';
    const feedbackName = getFeedbackName(event.feedbackRequired);
    let feedbackLabel = event.feedbackRequired
      ? 'NB: Dette arrangementet krever tilbakemelding'
      : 'Tilbakemelding';
    feedbackLabel = event.feedbackDescription
      ? `${feedbackLabel}: ${event.feedbackDescription}`
      : feedbackLabel;
    const showStripe =
      event.isPriced &&
      registration &&
      registration.pool &&
      !['pending', 'succeeded'].includes(registration.chargeStatus);
    return (
      <Flex column className={styles.join}>
        <div className={styles.joinHeader}>Bli med på dette arrangementet</div>
        <Link to="/pages/rules" style={{ marginTop: 0 }}>
          <Flex alignItems="center">
            <Icon name="document" style={{ marginRight: '4px' }} />
            <span>Regler for Abakus&#39; arrangementer</span>
          </Flex>
        </Link>
        {!this.state.formOpen &&
          this.state.time && (
            <div>
              Åpner <Time time={this.state.time} format="nowToTimeInWords" />
            </div>
          )}
        {!this.state.formOpen &&
          !this.state.time && (
            <div>Du kan ikke melde deg på dette arrangementet.</div>
          )}
        {this.state.formOpen && (
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
              {!registration &&
                this.state.captchaOpen &&
                event.useCaptcha && (
                  <Field
                    name="captchaResponse"
                    fieldStyle={{ width: 304 }}
                    component={Captcha.Field}
                  />
                )}
              {this.state.time && (
                <Button disabled={disabledButton}>
                  {`Åpner om ${this.state.time}`}
                </Button>
              )}
              {this.state.buttonOpen &&
                !event.loading && (
                  <div>
                    {!registration &&
                      event.spotsLeft === 0 &&
                      event.activeCapacity > 0 && (
                        <div>
                          Det 0 plasser igjen, du blir registrert til
                          venteliste.
                        </div>
                      )}
                    {!registration &&
                      event.spotsLeft === 1 && <div>Det er 1 plass igjen.</div>}
                    {!registration &&
                      event.spotsLeft > 0 && (
                        <div>Det er {event.spotsLeft} plasser igjen.</div>
                      )}
                    <Button submit disabled={disabledButton}>
                      {title || joinTitle}
                    </Button>
                  </div>
                )}
              {event.loading && (
                <LoadingIndicator
                  loading
                  loadingStyle={{ margin: '5px auto' }}
                />
              )}
            </Form>
          </Flex>
        )}
        {showStripe &&
          event.price && (
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
    );
  }
}

function getFeedbackName(feedbackRequired) {
  return feedbackRequired ? 'feedbackRequired' : 'feedback';
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
  connect(mapStateToProps, null),
  reduxForm({
    form: 'joinEvent',
    validate: validateEventForm
  })
)(JoinEventForm);
