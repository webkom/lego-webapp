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

type FormState = {
  error?: {
    type: string,
    code: string,
    message: string,
    doc_url: string
  },
  success?: boolean
};

type State = {
  paymentRequest?: Object,
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
class _SplitForm extends React.Component<FormProps, FormState> {
  state = {};
  handleSubmit = async ev => {
    ev.preventDefault();
    const { stripe, createPaymentIntent } = this.props;
    if (stripe) {
      const { payload } = await createPaymentIntent();
      const { error } = await stripe.handleCardPayment(payload.clientSecret);
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ success: true });
      }
    }
  };
  render() {
    const { success, error } = this.state;
    return !success ? (
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
        {error && <div className={stripeStyles.error}>{error.message}</div>}
      </form>
    ) : (
      <div className={stripeStyles.success}>
        {success &&
          `Din betaling på ${this.props.event.price / 100} kr ble godkjent.`}
      </div>
    );
  }
}

class _PaymentRequestForm extends React.Component<
  FormProps,
  State & FormState
> {
  constructor(props) {
    super(props);

    this.state = {};

    const { event } = props;

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
      const { stripe, createPaymentIntent } = this.props;
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
        complete('success');
        const { error } = await stripe.handleCardPayment(clientSecret);
        if (error) {
          this.setState({ error });
        } else {
          this.setState({ success: true });
        }
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
    const { success, error } = this.state;
    return (
      <div style={{ flex: 1 }}>
        {this.state.canMakePayment && (
          <>
            !success ?
            <>
              <PaymentRequestButtonElement
                paymentRequest={this.state.paymentRequest}
                className={stripeStyles.PaymentRequestButton}
                style={{
                  paymentRequestButton: {
                    height: '41px'
                  }
                }}
              />
              {error && (
                <div className={stripeStyles.error}>{error.message}</div>
              )}
            </>{' '}
            :
            <div className={stripeStyles.success}>
              {success &&
                `Din betaling på ${this.props.event.price /
                  100} kr ble godkjent.`}
            </div>
          </>
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
