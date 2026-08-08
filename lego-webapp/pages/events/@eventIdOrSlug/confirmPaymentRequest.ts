import type {
  PaymentMethod,
  PaymentRequestCompleteStatus,
  Stripe,
} from '@stripe/stripe-js';

const GENERIC_ERROR =
  'Det oppsto en ukjent feil. Hvis problemet vedvarer, ta kontakt med Webkom.';

export const PAYMENT_NOT_READY_ERROR =
  'Betalingen er ikke klar enda. Vent et øyeblikk og prøv igjen.';

type ConfirmPaymentRequestArgs = {
  stripe: Stripe;
  clientSecret: string | undefined;
  paymentMethod: PaymentMethod;
  complete: (status: PaymentRequestCompleteStatus) => void;
  setError: (errorMessage: string) => void;
  setLoading: (loading: boolean) => void;
  setSuccess: () => void;
};

/**
 * Confirms a wallet (Apple Pay / Google Pay) payment triggered by a Stripe
 * `paymentmethod` event.
 *
 * `complete()` must be called on every path to dismiss the wallet sheet –
 * if it isn't, the Apple Pay / Google Pay sheet spins forever (the bug this
 * replaced). `complete('success')` is sent before running any required next
 * actions (e.g. 3D Secure), as recommended by Stripe:
 * https://docs.stripe.com/stripe-js/elements/payment-request-button#complete-payment-intents
 */
export const confirmPaymentRequest = async ({
  stripe,
  clientSecret,
  paymentMethod,
  complete,
  setError,
  setLoading,
  setSuccess,
}: ConfirmPaymentRequestArgs) => {
  if (!clientSecret) {
    complete('fail');
    setError(PAYMENT_NOT_READY_ERROR);
    return;
  }

  try {
    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: paymentMethod.id },
      { handleActions: false },
    );

    if (confirmError) {
      complete('fail');
      setError(confirmError.message ?? GENERIC_ERROR);
      return;
    }
  } catch {
    complete('fail');
    setError(GENERIC_ERROR);
    return;
  }

  complete('success');
  setLoading(true);

  try {
    const { error } = await stripe.confirmCardPayment(clientSecret);

    if (error) {
      setError(error.message ?? GENERIC_ERROR);
    } else {
      setSuccess();
    }
  } catch {
    setError(GENERIC_ERROR);
  }

  setLoading(false);
};
