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
import StripeCheckout from 'react-stripe-checkout';
import Button from 'app/components/Button';
import styles from './StripeElement.css';
import stripeStyles from './Stripe.css';
import logoImage from 'app/assets/kule.png';
import type { EventRegistrationChargeStatus, User, Event } from 'app/models';


type Props = {
  event: Event,
  currentUser: User,
  onToken: (token: string) => Promise<*>,
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
class _SplitForm extends React.Component {
  handleSubmit = ev => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then(payload => console.log('[token]', payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  render() {
    return (
      <form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
        <label>
          Kortnummer
          <CardNumberElement
            className={stripeStyles.StripeElement}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label>
          Utløpsdato
          <CardExpiryElement
            className={stripeStyles.StripeElement}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label>
          CVC
          <CardCVCElement
            className={stripeStyles.StripeElement}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button>Betal</button>
      </form>
    );
  }
}

class _PaymentRequestForm extends React.Component<FormProps, State> {
  constructor(props) {
    super(props);

    const { event, onToken } = props;
    console.log(props.stripe);

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

    paymentRequest.on('token', async ({ complete, token, ...data }) => {
      await onToken(token);
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
    const { chargeStatus, event, onToken, currentUser } = this.props;
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

        {this.state.canMakePayment === false && (
          <StripeCheckout
            name="Abakus"
            description={event.title}
            image={logoImage}
            currency="NOK"
            allowRememberMe
            locale="no"
            token={onToken}
            stripeKey={config.stripeKey}
            amount={event.price}
            email={currentUser.email}
          >
            <Button style={{ width: 130 }}>Betal nå</Button>
          </StripeCheckout>
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
