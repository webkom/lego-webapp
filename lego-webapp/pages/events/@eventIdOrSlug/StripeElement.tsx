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
import { payment } from '~/redux/actions/EventActions';
import { useAppDispatch } from '~/redux/hooks';
import { appConfig } from '~/utils/appConfig';
import { useTheme } from '~/utils/themeUtils';
import { confirmPaymentRequest } from './confirmPaymentRequest';
import stripeStyles from './Stripe.module.css';
import type {
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
} from '@stripe/stripe-js';
import type { EventRegistrationPaymentStatus } from 'app/models';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from '~/redux/models/Event';
import type { CurrentUser } from '~/redux/models/User';

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

type SharedFormProps = FormProps & {
  setError: (errorMessage: string) => void;
  setSuccess: () => void;
  setLoading: (loading: boolean) => void;
};
type CardFormProps = SharedFormProps & {
  legend: string;
};
type PaymentRequestFormProps = SharedFormProps & {
  setCanPaymentRequest: (arg0: boolean) => void;
};

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
      const card = elements?.getElement(CardNumberElement);
      if (!card || !stripe) {
        setError(
          'Teknisk feil, skjemaet har ikke blitt startet riktig. Ta kontakt med Webkom om problemet vedvarer.',
        );
        return;
      }
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
        setError(
          error.message ?? 'Det skjedde en ukjent feil med betalingen din.',
        );
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
        <legend className={stripeStyles.elementsLegend}>{props.legend}</legend>
        <label data-test-id="cardnumber-input">
          Kortnummer
          <CardNumberElement
            className={stripeStyles.stripeElement}
            options={StripeElementStyle(fontColor)}
          />
        </label>
        <label data-test-id="expiry-input">
          Utløpsdato
          <CardExpiryElement
            className={stripeStyles.stripeElement}
            options={StripeElementStyle(fontColor)}
          />
        </label>
        <label data-test-id="cvc-input">
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
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null,
  );
  const [canMakePayment, setCanMakePayment] = useState(false);

  const stripe = useStripe();

  const {
    event,
    paymentError,
    clientSecret,
    setError,
    setSuccess,
    setLoading,
    setCanPaymentRequest,
  } = props;

  // Create the PaymentRequest instance once Stripe and the event are ready.
  useEffect(() => {
    if (paymentRequest || !stripe || !event) {
      return;
    }

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

    paymentReq.canMakePayment().then((result) => {
      setCanMakePayment(!!result);
      setCanPaymentRequest(!!result);
    });

    setPaymentRequest(paymentReq);
  }, [paymentRequest, stripe, event, setCanPaymentRequest]);

  // (Re)register the `paymentmethod` listener whenever its dependencies change,
  // so it always confirms with the current clientSecret. The handler *must*
  // call `complete()` within 30s to dismiss the Apple Pay / Google Pay sheet –
  // otherwise it spins forever.
  useEffect(() => {
    if (!paymentRequest || !stripe) {
      return;
    }

    const handlePaymentMethod = ({
      paymentMethod,
      complete,
    }: PaymentRequestPaymentMethodEvent) =>
      confirmPaymentRequest({
        stripe,
        clientSecret,
        paymentMethod,
        complete,
        setError,
        setLoading,
        setSuccess,
      });

    paymentRequest.on('paymentmethod', handlePaymentMethod);

    return () => {
      paymentRequest.off('paymentmethod', handlePaymentMethod);
    };
  }, [paymentRequest, stripe, clientSecret, setError, setSuccess, setLoading]);

  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
    }
  }, [paymentError, setError]);

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      {canMakePayment && paymentRequest && (
        <PaymentRequestButtonElement
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

const stripePromise = loadStripe(appConfig.stripeKey);

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
        data-test-id="stripe"
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
            legend={
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
