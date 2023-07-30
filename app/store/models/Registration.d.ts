import type { Dateish } from 'app/models';
import type { PhotoConsent, PublicUser } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

interface Registration {
  id: ID;
  user: PublicUser;
  createdBy: ID;
  updatedBy: ID;
  pool: ID;
  event: ID;
  presence: string; //TODO: enum
  feedback: string;
  sharedMemberships: unknown;
  status: string; //TODO: enum
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  adminRegistrationReason: string;
  paymentIntentId: string | null;
  paymentStatus: string | null; //TODO: enum
  paymentAmount: number;
  paymentAmountRefunded: number;
  LEGACYPhotoConsent: string; //TODO: enum
  photoConsents: PhotoConsent[];
}

export type AnonymizedRegistration = Pick<
  Registration,
  'id' | 'pool' | 'status'
>;

export type PublicRegistration = Pick<
  Registration,
  'id' | 'user' | 'pool' | 'status'
>;

export type ReadRegistration = Pick<
  Registration,
  | 'feedback'
  | 'sharedMemberships'
  | 'presence'
  | 'LEGACYPhotoConsent'
  | 'status'
  | 'event'
> &
  PublicRegistration;

export type SearchRegistration = Pick<
  Registration,
  'presence' | 'LEGACYPhotoConsent'
> &
  PublicRegistration;

export type PaymentRegistration = Pick<Registration, 'paymentStatus'> &
  ReadRegistration;

export type DetailedRegistration = Pick<
  Registration,
  | 'id'
  | 'user'
  | 'createdBy'
  | 'updatedBy'
  | 'pool'
  | 'event'
  | 'presence'
  | 'feedback'
  | 'status'
  | 'registrationDate'
  | 'unregistrationDate'
  | 'adminRegistrationReason'
  | 'paymentIntentId'
  | 'paymentStatus'
  | 'paymentAmount'
  | 'paymentAmountRefunded'
  | 'LEGACYPhotoConsent'
  | 'photoConsents'
>;

export type UnknownRegistration =
  | AnonymizedRegistration
  | PublicRegistration
  | ReadRegistration
  | SearchRegistration
  | PaymentRegistration
  | DetailedRegistration;
