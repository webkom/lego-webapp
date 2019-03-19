// @flow
import { pick } from 'lodash';
import moment from 'moment-timezone';
import type { TransformEvent, EventType } from 'app/models';

export const eventTypes = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Kurs',
  kid_event: 'KID-arrangement',
  party: 'Fest',
  social: 'Sosialt',
  other: 'Annet',
  event: 'Arrangement'
};

export const EVENT_TYPE_TO_STRING = (eventType: EventType) => {
  return eventTypes[eventType] || eventTypes['other'];
};

const TYPE_COLORS = {
  company_presentation: '#A1C34A',
  lunch_presentation: '#A1C34A',
  course: '#52B0EC',
  kid_event: '#111',
  party: '#FCD748',
  social: '#B11C11',
  event: '#B11C11',
  other: '#111'
};

export const colorForEvent = (eventType: EventType) => {
  return TYPE_COLORS[eventType] || TYPE_COLORS['other'];
};

// Event fields that should be created or updated based on the API.
const eventCreateAndUpdateFields = [
  'id',
  'title',
  'cover',
  'description',
  'text',
  'company',
  'feedbackDescription',
  'feedbackRequired',
  'eventType',
  'location',
  'isPriced',
  'priceMember',
  'priceGuest',
  'useStripe',
  'paymentDueDate',
  'startTime',
  'endTime',
  'mergeTime',
  'useCaptcha',
  'tags',
  'pools',
  'unregistrationDeadline',
  'pinned',
  'heedPenalties',
  'isAbakomOnly',
  'useConsent'
];

const poolCreateAndUpdateFields = [
  'id',
  'name',
  'capacity',
  'activationDate',
  'permissionGroups'
];

export const transformEvent = (data: TransformEvent, edit: boolean = false) => {
  let priceMember = 0;
  if (data.isPriced) {
    priceMember =
      (data.addFee ? addStripeFee(data.priceMember) : data.priceMember) * 100;
  }

  return {
    ...pick(data, eventCreateAndUpdateFields),
    startTime: moment(data.startTime).toISOString(),
    endTime: moment(data.endTime).toISOString(),
    mergeTime:
      data.pools.length >= 2 ? moment(data.mergeTime).toISOString() : null,
    company: data.company && data.company.value,
    responsibleGroup: data.responsibleGroup && data.responsibleGroup.value,
    priceMember,
    paymentDueDate: data.isPriced
      ? moment(data.paymentDueDate).toISOString()
      : null,
    unregistrationDeadline: data.unregistrationDeadline
      ? moment(data.unregistrationDeadline).toISOString()
      : null,
    pools: data.pools.map(pool => ({
      ...pick(pool, poolCreateAndUpdateFields),
      activationDate: moment(pool.activationDate).toISOString(),
      permissionGroups: pool.permissionGroups.map(group => group.value)
    }))
  };
};

export const paymentPending = 'pending';
export const paymentSuccess = 'succeeded';
export const paymentFailure = 'failed';
export const paymentManual = 'manual';
export const paymentCardDeclined = 'card_declined';
export const paymentCardExpired = 'expired_card';

const paymentSuccessMappings = {
  [paymentManual]: true,
  [paymentSuccess]: true,
  [paymentPending]: false,
  [paymentFailure]: false
};

export const hasPaid = (chargeStatus: string) =>
  paymentSuccessMappings[chargeStatus];

export const addStripeFee = (price: number) => Math.ceil(price * 1.012 + 1.8);
