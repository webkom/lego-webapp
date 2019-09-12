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
  chargeStatus: EventRegistrationChargeStatus
};

type StripeError = {
  type: string,
  code: string,
  message: string,
  doc_url: string
};

type FormProps = Props & {
  fontSize?: number
};

type _SplitFormProps = FormProps & {
  ledgend: string,
  setError: Object => void,
  setSuccess: () => void,
  setLoading: boolean => void,
  stripe: Stripe
};

type _PaymentRequestFormProps = FormProps & {
  setError: Object => void,
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
class _SplitForm extends React.Component<_SplitFormProps, FormState> {
  handleSubmit = async ev => {
    ev.preventDefault();
    const { stripe, createPaymentIntent } = this.props;
    if (stripe) {
      const { payload } = await createPaymentIntent();
      this.props.setLoading(true);
      const { error } = await stripe.handleCardPayment(payload.clientSecret);
      if (error) {
        this.props.setError(error);
      } else {
        this.props.setSuccess();
      }
      this.props.setLoading(false);
    }
  };
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
        </fieldset>
      </form>
    );
  }
}

class _PaymentRequestForm extends React.Component<
  _PaymentRequestFormProps,
  State
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

    paymentRequest.on('paymentmethod', async ({ paymentMethod, complete }) => {
      const { stripe, createPaymentIntent } = this.props;
      const { payload } = await createPaymentIntent();
      const { error: confirmError } = await stripe.confirmPaymentIntent(
        payload.clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );
      if (confirmError) {
        complete('fail');
      } else {
        complete('success');
        this.props.setLoading(true);
        const { error } = await stripe.handleCardPayment(payload.clientSecret);
        if (error) {
          this.props.setError(error);
        } else {
          this.props.setSuccess();
        }
        this.props.setLoading(false);
      }
    });

    paymentRequest.canMakePayment().then(result => {
      this.setState({ canMakePayment: !!result });
      this.props.setPaymentRequest(!!result);
    });

    this.state = {
      canMakePayment: undefined,
      paymentRequest
    };
  }

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

const PaymentRequestForm = injectStripe(_PaymentRequestForm);
const SplitForm = injectStripe(_SplitForm);

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
    return !success ? (
      <>
        {loading && <LoadingIndicator loading />}
        {error && <div className={stripeStyles.error}>{error.message}</div>}
        <div style={{ display: loading ? 'none' : 'block' }}>
          <Elements locale="no">
            <PaymentRequestForm
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
            <SplitForm
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
    ) : (
      <div className={stripeStyles.success}>
        {`Din betaling på ${
          this.props.event.price ? this.props.event.price / 100 : ''
        } kr ble godkjent.`}
      </div>
    );
  }
}

const WithProvider = (props: Props) => (
  <StripeProvider apiKey={config.stripeKey}>
    <PaymentForm {...props} />
  </StripeProvider>
);
export default WithProvider;
