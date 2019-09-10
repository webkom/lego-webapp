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
  createPaymentIntent: () => Promise<*>,
  chargeStatus: EventRegistrationChargeStatus
};

type FormProps = Props & {
  stripe: {
    paymentRequest: Object => Object,
    handleCardPayment: string => Promise<*>,
    confirmPaymentIntent: (string, Object) => Promise<*>
  },
  fontSize: number
};

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
      this.props
        .createPaymentIntent()
        .then(({ payload }) =>
          this.props.stripe.handleCardPayment(payload.clientSecret)
        );
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

    const { event, createPaymentIntent } = props;

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
      const { stripe } = this.props;
      const { payload: clientSecret } = await createPaymentIntent();
      const { error: confirmError } = await stripe.confirmPaymentIntent(
        clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );
      if (confirmError) {
        complete('fail');
      } else {
        const { error, paymentIntent } = await stripe.handleCardPayment(
          clientSecret
        );
        complete('success');
      }
    });

    paymentRequest.canMakePayment().then(result => {
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
    <>
      <div style={{ flexDirection: 'column', display: 'flex' }}>
        <Elements locale="no">
          <PaymentRequestForm {...props} />
        </Elements>
      </div>
      <Elements locale="no">
        <SplitForm {...props} fontSize={'18px'} />
      </Elements>
    </>
  </StripeProvider>
);
export default WithProvider;
