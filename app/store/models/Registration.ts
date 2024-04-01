import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type {
  DetailedUser,
  PhotoConsent,
  PublicUser,
} from 'app/store/models/User';

export enum Presence {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  NOT_PRESENT = 'NOT_PRESENT',
  UNKNOWN = 'UNKNOWN',
}

interface Registration {
  id: EntityId;
  user: PublicUser;
  detailedUser: DetailedUser;
  createdBy: EntityId;
  updatedBy: EntityId;
  pool: EntityId;
  event: EntityId;
  presence: Presence;
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
> & {
  user: DetailedUser;
};

export type UnknownRegistration = (
  | AnonymizedRegistration
  | PublicRegistration
  | ReadRegistration
  | SearchRegistration
  | PaymentRegistration
  | DetailedRegistration
) & {
  fetching?: boolean;
};
