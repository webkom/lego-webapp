import type { EntityId } from '@reduxjs/toolkit';
import type {
  Dateish,
  EventRegistrationPaymentStatus,
  EventRegistrationStatus,
  LEGACY_EventRegistrationPhotoConsent,
} from 'app/models';
import type { PhotoConsent } from 'app/store/models/User';

export enum Presence {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  NOT_PRESENT = 'NOT_PRESENT',
  UNKNOWN = 'UNKNOWN',
}

interface Registration {
  id: EntityId;
  user: EntityId;
  createdBy: EntityId;
  updatedBy: EntityId;
  pool: EntityId;
  event: EntityId;
  presence: Presence;
  feedback: string;
  sharedMemberships: unknown;
  status: EventRegistrationStatus;
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  adminRegistrationReason: string;
  paymentIntentId: string | null;
  paymentStatus: EventRegistrationPaymentStatus | null;
  paymentAmount: number;
  paymentAmountRefunded: number;
  LEGACYPhotoConsent: LEGACY_EventRegistrationPhotoConsent;
  photoConsents: PhotoConsent[];

  // Added in manual reducers
  fetching?: boolean;
  unregistering?: boolean;
  paymentError?: string;
  clientSecret?: string;
}

// Only used in websockets
export type AnonymizedRegistration = Pick<
  Registration,
  'id' | 'pool' | 'status' | 'fetching' | 'unregistering'
>;

// Only used in websockets
export type PublicRegistration = Pick<
  Registration,
  'id' | 'user' | 'pool' | 'status' | 'fetching' | 'unregistering'
>;

// Used in normal event views unless event has payment
export type ReadRegistration = Pick<
  Registration,
  | 'feedback'
  | 'sharedMemberships'
  | 'presence'
  | 'LEGACYPhotoConsent'
  | 'status'
  | 'event'
  | 'fetching'
  | 'unregistering'
> &
  PublicRegistration;

// Used in normal event views for events with payment
export type PaymentRegistration = Pick<
  Registration,
  'paymentStatus' | 'paymentError' | 'clientSecret'
> &
  ReadRegistration;

// Used in AbaCard
export type SearchRegistration = Pick<
  Registration,
  'presence' | 'LEGACYPhotoConsent'
> &
  PublicRegistration;

// Admin views
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
  | 'fetching'
  | 'unregistering'
>;

export type UnknownRegistration =
  | AnonymizedRegistration
  | PublicRegistration
  | ReadRegistration
  | PaymentRegistration
  | DetailedRegistration;
