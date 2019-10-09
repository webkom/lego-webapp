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
import type { EventRegistrationPaymentStatus, User, Event } from 'app/models';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Stripe = {
  paymentRequest: Object => Object,
  handleCardPayment: string => Promise<*>,
  confirmPaymentIntent: (string, Object) => Promise<*>
};

type Props = {
  event: Event,
  currentUser: User,
  createPaymentIntent: () => Promise<*>,
  paymentStatus: EventRegistrationPaymentStatus,
  clientSecret?: string
};

/*
 * Taken from https://stripe.com/docs/api/errors
 */
type StripeError = {
  type: string,
  charge: string,
  code: string,
  decline_code: string,
  message: string,
  param: string,
  doc_url: string,
  payment_intent: Object,
  setup_intent: Object,
  source: Object
};

type FormProps = Props & {
  fontSize?: number
};

type CardFormProps = FormProps & {
  ledgend: string,
  setError: StripeError => void,
  setSuccess: () => void,
  setLoading: boolean => void,
  stripe: Stripe,
  paymentStarted: boolean
};

type PaymentRequestFormProps = FormProps & {
  setError: StripeError => void,
  setSuccess: () => void,
  setLoading: boolean => void,
  setPaymentRequest: boolean => void,
  stripe: Stripe
};

type FormState = {
  error?: StripeError | null,
  success?: boolean,
  loading: boolean,
  paymentRequest: boolean
};

type CardFormState = {
  paymentStarted: boolean
};

type PaymentRequestFormState = {
  paymentRequest?: Object,
  canMakePayment?: boolean,
  paymentMethodId?: string,
  complete?: string => void
};

const StripeElementStyle = {
  style: {
    base: {
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
};

class CardForm extends React.Component<CardFormProps, CardFormState> {
  state = {
    paymentStarted: false
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const { stripe, createPaymentIntent, clientSecret } = this.props;
    if (stripe) {
      clientSecret || createPaymentIntent();
      this.props.setLoading(true);
      this.setState({ paymentStarted: true });
    }
  };

  completePayment = async clientSecret => {
    this.setState({ paymentStarted: false });
    const { stripe } = this.props;
    const { error } = await stripe.handleCardPayment(clientSecret);
    if (error) {
      this.props.setError(error);
    } else {
      this.props.setSuccess();
    }
    this.props.setLoading(false);
  };

  componentDidUpdate(prevProps) {
    if (this.props.clientSecret && this.state.paymentStarted) {
      this.completePayment(this.props.clientSecret);
    }
  }

  render() {
    return (
      <form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
        <fieldset className={stripeStyles.elementsFieldset}>
          <legend className={stripeStyles.elementsLedgend}>
            {this.props.ledgend}
          </legend>
          <label className={stripeStyles.StripeLabel}>
            Kortnummer
            <CardNumberElement
              className={stripeStyles.StripeElement}
              {...StripeElementStyle}
            />
          </label>
          <label className={stripeStyles.StripeLabel}>
            Utløpsdato
            <CardExpiryElement
              className={stripeStyles.StripeElement}
              {...StripeElementStyle}
            />
          </label>
          <label className={stripeStyles.StripeLabel}>
            CVC
            <CardCVCElement
              className={stripeStyles.StripeElement}
              {...StripeElementStyle}
            />
          </label>
          <button className={stripeStyles.StripeButton}>Betal</button>
        </fieldset>
      </form>
    );
  }
}

class PaymentRequestForm extends React.Component<
  PaymentRequestFormProps,
  PaymentRequestFormState
> {
  constructor(props) {
    super(props);

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

    paymentRequest.on('paymentmethod', ({ paymentMethod, complete }) => {
      this.setState({ complete, paymentMethodId: paymentMethod.id });
      if (this.props.clientSecret) {
        this.completePayment(this.props.clientSecret);
      } else {
        this.props.createPaymentIntent();
      }
    });

    paymentRequest.canMakePayment().then(async result => {
      this.setState({ canMakePayment: !!result });
      this.props.setPaymentRequest(!!result);
    });

    this.state = {
      canMakePayment: undefined,
      paymentInProgress: false,
      paymentRequest
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.clientSecret && this.props.clientSecret) {
      this.completePayment(this.props.clientSecret);
    }
  }

  completePayment = async clientSecret => {
    const { stripe } = this.props;
    const { paymentMethodId, complete } = this.state;

    if (!complete || !paymentMethodId) {
      return;
    }

    const { error: confirmError } = await stripe.confirmPaymentIntent(
      clientSecret,
      {
        payment_method: paymentMethodId
      }
    );
    if (confirmError) {
      complete('fail');
      return;
    }
    complete('success');
    this.props.setLoading(true);

    const { error } = await stripe.handleCardPayment(clientSecret);
    if (error) {
      this.props.setError(error);
    } else {
      this.props.setSuccess();
    }
    this.props.setLoading(false);
  };

  render() {
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

const InjectedPaymentRequestForm = injectStripe(PaymentRequestForm);
const InjectedCardForm = injectStripe(CardForm);

class PaymentForm extends React.Component<FormProps, FormState> {
  state = {
    loading: false,
    paymentRequest: false,
    error: null,
    success: false
  };

  setSuccess = () => this.setState({ success: true });

  setError = error => this.setState({ error });

  setLoading = loading => {
    this.setState({ loading });
    loading && this.setState({ error: null });
  };

  setPaymentRequest = paymentRequest => this.setState({ paymentRequest });

  render() {
    const { success, error, loading } = this.state;
    return success ? (
      <div className={stripeStyles.success}>
        {`Din betaling på ${
          this.props.event.price
            ? (this.props.event.price / 100).toFixed(2).replace('.', ',')
            : ''
        } kr ble godkjent.`}
      </div>
    ) : (
      <>
        {loading && <LoadingIndicator loading />}
        {error && <div className={stripeStyles.error}>{error.message}</div>}
        <div style={{ display: loading ? 'none' : 'block' }}>
          <Elements locale="no">
            <InjectedPaymentRequestForm
              {...this.props}
              setSuccess={() => this.setSuccess()}
              setError={error => this.setError(error)}
              setLoading={loading => this.setLoading(loading)}
              setPaymentRequest={paymentRequest =>
                this.setPaymentRequest(paymentRequest)
              }
            />
          </Elements>
          <Elements locale="no">
            <InjectedCardForm
              {...this.props}
              fontSize={'18px'}
              setSuccess={() => this.setSuccess()}
              setError={error => this.setError(error)}
              setLoading={loading => this.setLoading(loading)}
              ledgend={
                this.state.paymentRequest
                  ? 'Eller skriv inn kortinformasjon'
                  : 'Skriv inn kortinformasjon'
              }
            />
          </Elements>
        </div>
      </>
    );
  }
}

const WithProvider = (props: Props) => (
  <StripeProvider apiKey={config.stripeKey}>
    <PaymentForm {...props} />
  </StripeProvider>
);
export default WithProvider;
