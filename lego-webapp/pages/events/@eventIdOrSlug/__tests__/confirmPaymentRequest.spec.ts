import { describe, it, expect, vi } from 'vitest';
import { confirmPaymentRequest } from '../confirmPaymentRequest';
import type { PaymentMethod, Stripe } from '@stripe/stripe-js';

const paymentMethod = { id: 'pm_123' } as unknown as PaymentMethod;

const GENERIC_ERROR =
  'Det oppsto en ukjent feil. Hvis problemet vedvarer, ta kontakt med Webkom.';

// Shapes returned by stripe.confirmCardPayment, see
// https://docs.stripe.com/js/payment_intents/confirm_card_payment
const requiresAction = {
  paymentIntent: { id: 'pi_123', status: 'requires_action' },
};
const succeeded = { paymentIntent: { id: 'pi_123', status: 'succeeded' } };
const declined = {
  error: {
    type: 'card_error',
    code: 'card_declined',
    message: 'Your card was declined.',
  },
};
const authenticationFailure = {
  error: {
    type: 'card_error',
    code: 'payment_intent_authentication_failure',
    message: 'We are unable to authenticate your payment method.',
  },
};

type ConfirmOutcome = Record<string, unknown> | Error;

const setup = (outcomes: ConfirmOutcome[]) => {
  const confirmCardPayment = vi.fn();
  outcomes.forEach((outcome) =>
    outcome instanceof Error
      ? confirmCardPayment.mockRejectedValueOnce(outcome)
      : confirmCardPayment.mockResolvedValueOnce(outcome),
  );
  return {
    stripe: { confirmCardPayment } as unknown as Stripe,
    confirmCardPayment,
    complete: vi.fn(),
    setError: vi.fn(),
    setLoading: vi.fn(),
    setSuccess: vi.fn(),
  };
};

describe('confirmPaymentRequest', () => {
  it('dismisses the wallet sheet and finalises the payment on success', async () => {
    const ctx = setup([requiresAction, succeeded]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    // The regression guard: the sheet must be dismissed, otherwise it spins forever.
    expect(ctx.complete).toHaveBeenCalledWith('success');
    // First call confirms with the wallet's PaymentMethod and defers next actions.
    expect(ctx.confirmCardPayment).toHaveBeenNthCalledWith(
      1,
      'cs_test',
      { payment_method: 'pm_123' },
      { handleActions: false },
    );
    // Second call runs any required next actions (e.g. 3D Secure).
    expect(ctx.confirmCardPayment).toHaveBeenNthCalledWith(2, 'cs_test');
    expect(ctx.setSuccess).toHaveBeenCalled();
    expect(ctx.setError).not.toHaveBeenCalled();
    expect(ctx.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('fails the sheet and surfaces the error when confirmation is rejected', async () => {
    const ctx = setup([declined]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('fail');
    expect(ctx.setError).toHaveBeenCalledWith('Your card was declined.');
    expect(ctx.setSuccess).not.toHaveBeenCalled();
    // Must not run the second confirmation after a failure.
    expect(ctx.confirmCardPayment).toHaveBeenCalledTimes(1);
  });

  it('still reports an error if a required next action fails after success', async () => {
    const ctx = setup([requiresAction, authenticationFailure]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('success');
    expect(ctx.setError).toHaveBeenCalledWith(
      'We are unable to authenticate your payment method.',
    );
    expect(ctx.setSuccess).not.toHaveBeenCalled();
    expect(ctx.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('fails the sheet when the first confirmation rejects', async () => {
    const ctx = setup([new Error('Network error')]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('fail');
    expect(ctx.setError).toHaveBeenCalledWith(GENERIC_ERROR);
    expect(ctx.setSuccess).not.toHaveBeenCalled();
    expect(ctx.confirmCardPayment).toHaveBeenCalledTimes(1);
  });

  it('keeps the sheet dismissed when the next action rejects', async () => {
    const ctx = setup([requiresAction, new Error('Network error')]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledTimes(1);
    expect(ctx.complete).toHaveBeenCalledWith('success');
    expect(ctx.setError).toHaveBeenCalledWith(GENERIC_ERROR);
    expect(ctx.setSuccess).not.toHaveBeenCalled();
    expect(ctx.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('fails the sheet without charging when there is no clientSecret', async () => {
    const ctx = setup([]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: undefined,
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('fail');
    expect(ctx.setError).toHaveBeenCalled();
    expect(ctx.confirmCardPayment).not.toHaveBeenCalled();
    expect(ctx.setSuccess).not.toHaveBeenCalled();
  });
});
