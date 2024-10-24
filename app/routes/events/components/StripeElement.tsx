import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
  Elements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Card, LoadingIndicator } from '@webkom/lego-bricks';
import { useState, useEffect, useCallback } from 'react';
import { payment } from 'app/actions/EventActions';
import config from 'app/config';
import { useAppDispatch } from 'app/store/hooks';
import { useTheme } from 'app/utils/themeUtils';
import stripeStyles from './Stripe.module.css';
import type { EventRegistrationPaymentStatus } from 'app/models';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { CurrentUser } from 'app/store/models/User';

type Props = {
  event: AuthUserDetailedEvent | UserDetailedEvent;
  currentUser: CurrentUser;
  paymentStatus: EventRegistrationPaymentStatus | null;
  clientSecret?: string;
  paymentError?: string;
};
type FormProps = Props & {
  fontSize?: string;
};
type CardFormProps = FormProps & {
  ledgend: string;
  setError: (arg0: string) => void;
  setSuccess: () => void;
  setLoading: (arg0: boolean) => void;
};
type PaymentRequestFormProps = FormProps & {
  setError: (arg0: string) => void;
  setSuccess: () => void;
  setLoading: (arg0: boolean) => void;
  setCanPaymentRequest: (arg0: boolean) => void;
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

function StripeElementStyle(fontColor) {
  return {
    style: {
      base: {
        color: fontColor,
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#8c8c8c',
        },
      },
      invalid: {
        color: '#c81917',
      },
    },
  };
}

const CardForm = (props: CardFormProps) => {
  const [paymentStarted, setPaymentStarted] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { clientSecret, setError, setSuccess, setLoading, currentUser } = props;

  const theme = useTheme();
  const fontColor = theme === 'dark' ? '#f2f2f2' : '#0d0d0d';

  const dispatch = useAppDispatch();

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (stripe) {
      clientSecret || dispatch(payment(props.event.id));
      setLoading(true);
      setPaymentStarted(true);
    }
  };

  const completePayment = useCallback(
    async (clientSecret) => {
      setPaymentStarted(false);
      const card = elements.getElement(CardNumberElement);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: currentUser.email,
            name: currentUser.fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess();
      }

      setLoading(false);
    },
    [stripe, elements, currentUser, setError, setSuccess, setLoading],
  );

  useEffect(() => {
    if (clientSecret && paymentStarted) {
      completePayment(clientSecret);
    }
  }, [clientSecret, paymentStarted, completePayment]);

  if (!stripe || !elements) {
    return <LoadingIndicator loading />;
  }

  return (
    <form
      style={{
        width: '100%',
      }}
      onSubmit={handleSubmit}
    >
      <fieldset className={stripeStyles.elementsFieldset}>
        <legend className={stripeStyles.elementsLedgend}>
          {props.ledgend}
        </legend>
        <label data-testid="cardnumber-input">
          Kortnummer
          <CardNumberElement
            className={stripeStyles.stripeElement}
            options={StripeElementStyle(fontColor)}
          />
        </label>
        <label data-testid="expiry-input">
          Utløpsdato
          <CardExpiryElement
            className={stripeStyles.stripeElement}
            options={StripeElementStyle(fontColor)}
          />
        </label>
        <label data-testid="cvc-input">
          CVC
          <CardCvcElement
            className={stripeStyles.stripeElement}
            options={StripeElementStyle(fontColor)}
          />
        </label>
        <Button submit dark className={stripeStyles.stripeButton}>
          Betal
        </Button>
      </fieldset>
    </form>
  );
};

const PaymentRequestForm = (props: PaymentRequestFormProps) => {
  const [complete, setComplete] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const stripe = useStripe();

  const {
    event,
    paymentError,
    clientSecret,
    createPaymentIntent,
    setError,
    setSuccess,
    setLoading,
    setCanPaymentRequest,
  } = props;

  const completePayment = useCallback(
    async (clientSecret) => {
      if (!complete || !paymentMethod) {
        return;
      }

      const { error: confirmError } = await stripe.confirmPaymentIntent(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        },
      );

      if (confirmError) {
        complete('fail');
        return;
      }

      complete('success');
      setLoading(true);
      const { error } = await stripe.handleCardPayment(clientSecret);

      if (error) {
        setError(error.message);
      } else {
        setSuccess();
      }

      setLoading(false);
    },
    [stripe, complete, paymentMethod, setError, setSuccess, setLoading],
  );

  const completePaymentManual = useCallback(
    async (status: CompleteStatus) => {
      if (!complete) {
        return;
      }

      setComplete(status);

      if (status === 'success') {
        setSuccess();
      }
    },
    [complete, setSuccess],
  );

  useEffect(() => {
    if (!paymentRequest && stripe && event) {
      const paymentReq = stripe.paymentRequest({
        currency: 'nok',
        total: {
          label: event.title,
          amount: event.price,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        country: 'NO',
      });
      paymentReq.on('paymentmethod', async ({ paymentMethod, complete }) => {
        setComplete(() => complete);
        setPaymentMethod(paymentMethod);

        if (clientSecret) {
          completePayment(clientSecret);
        } else {
          createPaymentIntent();
        }
      });
      paymentReq.canMakePayment().then((result) => {
        setCanMakePayment(!!result);
        setCanPaymentRequest(!!result);
      });
      setPaymentRequest(paymentReq);
    }
  }, [
    paymentRequest,
    clientSecret,
    stripe,
    event,
    completePayment,
    createPaymentIntent,
    setCanPaymentRequest,
  ]);

  useEffect(() => {
    if (clientSecret && completePayment && !paymentStarted) {
      setPaymentStarted(true);
      completePayment(clientSecret);
    }
  }, [clientSecret, completePayment, paymentStarted, completePaymentManual]);

  useEffect(() => {
    return () => {
      completePaymentManual('fail');
    };
  }, [completePaymentManual]);

  useEffect(() => {
    if (paymentError && setError && completePaymentManual) {
      completePaymentManual('fail');
      setError(paymentError);
    }
  }, [paymentError, completePaymentManual, setError]);

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      {canMakePayment && paymentRequest && (
        <PaymentRequestButtonElement
          onClick={(e) => {
            if (paymentMethod) {
              e.preventDefault();
              setError(
                'Det skjedde en feil under prosesseringen av betalingen. Vennligst refresh siden for å prøve igjen.',
              );
            }
          }}
          paymentRequest={paymentRequest}
          className={stripeStyles.PaymentRequestButton}
          options={{
            style: {
              paymentRequestButton: {
                height: '41px',
              },
            },
            paymentRequest,
          }}
        />
      )}
    </div>
  );
};

const stripePromise = loadStripe(config.stripeKey);

const PaymentForm = (props: FormProps) => {
  const [loading, _setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setLoading = (loading: boolean) => {
    _setLoading(loading);
    if (loading) {
      setError(null);
    }
  };

  if (success) {
    return (
      <Card severity="success">
        {`Din betaling på ${
          props.event.price
            ? (props.event.price / 100).toFixed(2).replace('.', ',')
            : ''
        } kr ble godkjent.`}
      </Card>
    );
  }

  return (
    <>
      {loading && <LoadingIndicator loading />}
      {error && <div className={stripeStyles.error}>{error}</div>}
      <div
        style={{
          display: loading ? 'none' : 'block',
        }}
      >
        <Elements stripe={stripePromise}>
          <PaymentRequestForm
            {...props}
            setSuccess={() => setSuccess(true)}
            setError={(error) => setError(error)}
            setLoading={(loading) => setLoading(loading)}
            setCanPaymentRequest={(paymentRequest) =>
              setPaymentRequest(paymentRequest)
            }
          />
          <CardForm
            {...props}
            fontSize="18px"
            setSuccess={() => setSuccess(true)}
            setError={(error) => setError(error)}
            setLoading={(loading) => setLoading(loading)}
            ledgend={
              paymentRequest
                ? 'Eller skriv inn kortinformasjon'
                : 'Skriv inn kortinformasjon'
            }
          />
        </Elements>
      </div>
    </>
  );
};

export default PaymentForm;
