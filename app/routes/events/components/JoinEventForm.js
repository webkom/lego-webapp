// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Captcha, TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';
import StripeCheckout from 'react-stripe-checkout';
import logoImage from 'app/assets/kule.png';
import LoadingIndicator from 'app/components/LoadingIndicator';

export type Props = {
  title: string,
  event: Event,
  registration: Object,
  currentUser: Object,
  onSubmit: void,
  onToken: void,
}

const JoinEventForm = (props) => {
  const {
    title, event, registration, currentUser,
    handleSubmit, onToken,
    invalid, pristine, submitting
  } = props;

  const disabledButton = invalid || pristine || submitting;
  const joinTitle = !registration ? 'MELD DEG PÅ' : 'AVREGISTRER';
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Field
          placeholder='Melding til arrangører (allergier etc)'
          name='feedback'
          component={TextEditor.Field}
        />
        {!registration && (
          <Field
            name='captchaResponse'
            fieldStyle={{ width: 304 }}
            component={Captcha.Field}
          />
        )}
        {!event.loading && (
          <Button type='submit' disabled={disabledButton}>
            {title || joinTitle}
          </Button>
        )}
        {event.loading && (<LoadingIndicator loading loadingStyle={{ margin: '5px auto' }} />)}
      </form>
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
};

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
