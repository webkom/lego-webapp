import { describe, it, expect, vi } from 'vitest';
import { confirmPaymentRequest } from '../confirmPaymentRequest';
import type { PaymentMethod, Stripe } from '@stripe/stripe-js';

const paymentMethod = { id: 'pm_123' } as unknown as PaymentMethod;

type ConfirmResult = { error?: { message?: string } };

const setup = (confirmResults: ConfirmResult[]) => {
  const confirmCardPayment = vi.fn();
  confirmResults.forEach((result) =>
    confirmCardPayment.mockResolvedValueOnce(result),
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
    const ctx = setup([{}, {}]); // both confirmation steps succeed

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
    const ctx = setup([{ error: { message: 'Card declined' } }]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('fail');
    expect(ctx.setError).toHaveBeenCalledWith('Card declined');
    expect(ctx.setSuccess).not.toHaveBeenCalled();
    // Must not run the second confirmation after a failure.
    expect(ctx.confirmCardPayment).toHaveBeenCalledTimes(1);
  });

  it('still reports an error if a required next action fails after success', async () => {
    const ctx = setup([{}, { error: { message: '3D Secure failed' } }]);

    await confirmPaymentRequest({
      ...ctx,
      clientSecret: 'cs_test',
      paymentMethod,
    });

    expect(ctx.complete).toHaveBeenCalledWith('success');
    expect(ctx.setError).toHaveBeenCalledWith('3D Secure failed');
    expect(ctx.setSuccess).not.toHaveBeenCalled();
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
