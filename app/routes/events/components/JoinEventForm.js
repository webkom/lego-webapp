// @flow

import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import moment from 'moment';
import { Captcha, TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';
import StripeCheckout from 'react-stripe-checkout';
import logoImage from 'app/assets/kule.png';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Time from 'app/components/Time';

export type Props = {
  title: string,
  event: Event,
  registration: Object,
  currentUser: Object,
  onSubmit: void,
  onToken: void,
}


class JoinEventForm extends Component {
  state = {
    time: null,
    formOpen: false,
    captchaOpen: false,
    buttonOpen: false,
    counter: null
  }

  componentDidMount() {
    this.parseEventTimes(this.props.event);
  }

  componentWillUnmount() {
    clearInterval(this.state.counter);
  }

  parseEventTimes = ({ activationTime, startTime }) => {
    const poolActivationTime = moment(activationTime);
    const currentTime = moment();
    const diffTime = poolActivationTime.diff(currentTime);
    let duration = moment.duration(diffTime, 'milliseconds');
    if (currentTime.isAfter(moment(startTime))) {
      // Do nothing
    } else if (poolActivationTime.isBefore(currentTime)) {
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
        time: poolActivationTime.format('HH:mm')
      });
      const interval = 10000;
      const checkDiffCounter = setInterval(() => {
        const diff = duration - interval;
        duration = moment.duration(diff, 'milliseconds');
        if (diff < 600000) {
          clearInterval(checkDiffCounter);
          this.initiateCountdown(duration);
        }
      }, interval);
      this.setState({
        counter: checkDiffCounter
      });
    } else {
      this.initiateCountdown(duration);
    }
  };

  initiateCountdown(duration) {
    const interval = 1000;
    duration += 1000;
    const counter = setInterval(() => {
      duration = moment.duration(duration, 'milliseconds') - interval;
      if (duration <= 1000) {
        clearInterval(counter);
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
      formOpen: true,
      counter
    });
  }

  render() {
    const {
      title, event, registration, currentUser,
      handleSubmit, onToken,
      invalid, pristine, submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;
    const joinTitle = !registration ? 'MELD DEG PÅ' : 'AVREGISTRER';
    return (
      <div>
        {!this.state.formOpen && this.state.time && (
          <div>
            Åpner <Time time={this.state.time} format='nowToTimeInWords' />
          </div>
        )}
        {!this.state.formOpen && !this.state.time && (
          <div>Det går ikke lenger å melde seg på.</div>
        )}
        {this.state.formOpen && (
          <form onSubmit={handleSubmit}>
            <Field
              placeholder='Melding til arrangører (allergier etc)'
              name='feedback'
              component={TextEditor.Field}
            />
            {!registration && this.state.captchaOpen && (
              <Field
                name='captchaResponse'
                fieldStyle={{ width: 304 }}
                component={Captcha.Field}
              />
            )}
            {this.state.time && (
              <Button disabled={disabledButton}>{`Åpner om ${this.state.time}`}</Button>
            )}
            {this.state.buttonOpen && !event.loading && (
              <Button type='submit' disabled={disabledButton}>
                {title || joinTitle}
              </Button>
            )}
            {event.loading && (<LoadingIndicator loading loadingStyle={{ margin: '5px auto' }} />)}
          </form>
        )}
        {registration && !registration.chargeStatus && event.isPriced && (
          <StripeCheckout
            name='Abakus Linjeforening'
            description={event.title}
            image={logoImage}
            currency='NOK'
            allowRememberMe={false}
            locale='no'
            token={onToken}
            stripeKey='pk_test_VWJmJ3yOunhMBkG71SXyjdqk'
            amount={event.price}
            email={currentUser.email}
          >
            <Button>Betal nå</Button>
          </StripeCheckout>
        )}
      </div>
    );
  }
}

function validateEventForm(data) {
  const errors = {};

  if (!data.feedback) {
    errors.feedback = 'Tilbakemelding er påkrevet for dette arrangementet';
  }

  if (!data.captchaResponse) {
    errors.captchaResponse = 'Captcha er ikke validert';
  }

  return errors;
}

export default reduxForm({
  form: 'joinEvent',
  validate: validateEventForm
})(JoinEventForm);
