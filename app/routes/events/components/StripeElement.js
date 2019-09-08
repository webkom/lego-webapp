//@flow
import React from 'react';
import {
  injectStripe,
  PaymentRequestButtonElement,
  Elements,
  StripeProvider,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement
} from 'react-stripe-elements';
import config from 'app/config';
import stripeStyles from './Stripe.css';
import type { EventRegistrationChargeStatus, User, Event } from 'app/models';

type Props = {
  event: Event,
  currentUser: User,
  onPaymentMethod: (paymentMethod: Object) => Promise<*>,
  chargeStatus: EventRegistrationChargeStatus
};

type FormProps = Props & { stripe: { paymentRequest: Object => Object } };

type State = {
  paymentRequest: Object,
  canMakePayment?: boolean
};
const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding
      },
      invalid: {
        color: '#9e2146'
      }
    }
  };
};
class _SplitForm extends React.Component<FormProps> {
  handleSubmit = ev => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createPaymentMethod('card', {
          billing_details: { name: 'Ola Nordmann' }
        })
        .then(payload => console.log('[token]', payload));
      //.then(paymentMethod => this.onPaymentMethod(paymentMethod))
      // This may actually be done the other way, that is, call server, then
      // call stripe.handleCardPayment(secret, elements) (recommended by stripe)
      // https://stripe.com/docs/payments/payment-intents/migration/automatic-confirmation#elements
      // well need to use webhooks in this case, in order to confirm the payment
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  render() {
    return (
      <form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
        <label className={stripeStyles.StripeLabel}>
          Kortnummer
          <CardNumberElement
            className={stripeStyles.StripeElement}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label className={stripeStyles.StripeLabel}>
          Utløpsdato
          <CardExpiryElement
            className={stripeStyles.StripeElement}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label className={stripeStyles.StripeLabel}>
          CVC
          <CardCVCElement
            className={stripeStyles.StripeElement}
            onReady={() => this.setState({})}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button className={stripeStyles.StripeButton}>Betal</button>
      </form>
    );
  }
}

class _PaymentRequestForm extends React.Component<FormProps, State> {
  constructor(props) {
    super(props);

    const { event, onPaymentMethod } = props;

    const paymentRequest = props.stripe.paymentRequest({
      currency: 'nok',
      total: {
        label: event.title,
        amount: event.price
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      country: 'NO'
    });

    paymentRequest.on('paymentmethod', async ({ paymentMethod, complete }) => {
      await onPaymentMethod(paymentMethod);
      complete('success');
    });

    paymentRequest.canMakePayment().then(result => {
      console.log('Res:', result);
      this.setState({ canMakePayment: !!result });
    });

    this.state = {
      canMakePayment: undefined,
      paymentRequest
    };
  }

  render() {
    const { chargeStatus } = this.props;
    return (
      <div style={{ flex: 1 }}>
        {this.state.canMakePayment && (
          <PaymentRequestButtonElement
            paymentRequest={this.state.paymentRequest}
            className={stripeStyles.PaymentRequestButton}
            style={{
              paymentRequestButton: {
                height: '41px'
              }
            }}
          />
        )}
      </div>
    );
  }
}
const PaymentRequestForm = injectStripe(_PaymentRequestForm);
const SplitForm = injectStripe(_SplitForm);

// TODO Move this to a "global" thing
const WithProvider = (props: Props) => (
  <StripeProvider apiKey={config.stripeKey}>
    <Elements locale="no">
      <>
        <div style={{ flexDirection: 'column', display: 'flex' }}>
          <PaymentRequestForm {...props} />
        </div>
        <SplitForm {...props} fontSize={'18px'} />
      </>
    </Elements>
  </StripeProvider>
);
export default WithProvider;
