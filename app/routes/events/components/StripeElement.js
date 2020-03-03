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
  clientSecret?: string,
  paymentError?: string
};

type FormProps = Props & {
  fontSize?: number
};

type CardFormProps = FormProps & {
  ledgend: string,
  setError: string => void,
  setSuccess: () => void,
  setLoading: boolean => void,
  stripe: Stripe,
  paymentStarted: boolean
};

type PaymentRequestFormProps = FormProps & {
  setError: string => void,
  setSuccess: () => void,
  setLoading: boolean => void,
  setPaymentRequest: boolean => void,
  stripe: Stripe
};

type FormState = {
  error?: string | null,
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

// See https://stripe.com/docs/js/appendix/payment_response#payment_response_object-complete
// for the statuses
type CompleteStatus =
  | 'success'
  | 'fail'
  | 'invalid_payer_name'
  | 'invalid_payer_phone'
  | 'invalid_payer_email'
  | 'invalid_shipping_address';

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
      this.props.setError(error.message);
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
    const { clientSecret, paymentError } = this.props;

    if (!prevProps.clientSecret && clientSecret) {
      this.completePayment(clientSecret);
    }
    if (paymentError) {
      this.completePaymentManual('fail');
      this.props.setError(paymentError);
    }
  }

  componentWillUnmount() {
    /*
     * If the component unmounts, the registration will have updated,
     * and the user will not be able to pay.
     * This can be because the payment updated in the backend,
     * or the user has unregistered. In the rare case that the payment has started
     * processing, we cancel just so the user does not have to wait until the
     * payment request times out.
     *
     */
    this.completePaymentManual('fail');
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
      this.props.setError(error.message);
    } else {
      this.props.setSuccess();
    }
    this.props.setLoading(false);
  };

  completePaymentManual = async (status: CompleteStatus) => {
    const { complete } = this.state;

    if (!complete) {
      return;
    }

    complete(status);

    if (status === 'success') {
      this.props.setSuccess();
    }
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
        {error && <div className={stripeStyles.error}>{error}</div>}
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
