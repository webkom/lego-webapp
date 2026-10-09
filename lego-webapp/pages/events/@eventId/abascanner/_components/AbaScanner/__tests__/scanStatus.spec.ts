import { describe, it, expect } from 'vitest';
import { getScanStatus } from '../scanStatus';

describe('getScanStatus', () => {
  it('maps a successful scan', () => {
    expect(getScanStatus('success')).toMatchObject({
      label: 'Møtt',
      isSuccess: true,
    });
  });

  it('maps a known backend error code', () => {
    expect(getScanStatus('waitlisted')).toMatchObject({
      label: 'Venteliste',
      isSuccess: false,
    });
  });

  it('falls back for unknown error codes', () => {
    expect(getScanStatus('something_new')).toMatchObject({
      label: 'Feil',
      isSuccess: false,
    });
  });

  it('only treats success as success', () => {
    const codes = [
      'already_present',
      'waitlisted',
      'not_registered',
      'unregistered',
      'missing_payment',
      'late_or_absent',
      'not_properly_registered',
      'no_user',
    ];
    codes.forEach((code) => expect(getScanStatus(code).isSuccess).toBe(false));
  });
});
