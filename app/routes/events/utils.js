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
  kid_event: '#111111',
  party: '#FCD748',
  social: '#B11C11',
  event: '#B11C11',
  other: '#111111'
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
  'eventStatusType',
  'location',
  'isPriced',
  'priceMember',
  'priceGuest',
  'useStripe',
  'paymentDueDate',
  'useCaptcha',
  'tags',
  'pools',
  'unregistrationDeadline',
  'pinned',
  'heedPenalties',
  'isAbakomOnly',
  'useConsent'
];

// Pool fields that should be created or updated based on the API
const poolCreateAndUpdateFields = [
  'id',
  'name',
  'capacity',
  'activationDate',
  'permissionGroups'
];

/* Calculate the event price
 * @param isPriced: If the event is priced
 * @param addFee: If the event uses Stipe and needs a fee
 */
const calculatePrice = data => {
  let price = 0;
  price = data.isPriced ? data.priceMember : price;
  price = data.addFee ? addStripeFee(data.priceMember) * 100 : price;
  return price;
};

/* Calculate the event location
 * @param eventStatusType: what kind of registrationmode this event has
 */
const calculateLocation = data =>
  data.eventStatusType == 'TBA' ? 'TBA' : data.location;

/* Calculate the event pools
 * @param eventStatusType: what kind of registrationmode this event has
 * @param pools: the event groups as specified by the CreateEvent forms
 */
const calcualtePools = data => {
  let pools = [];
  if (data.eventStatusType == 'TBA' || data.eventStatusType == 'OPEN') {
    pools = [];
  } else if (data.eventStatusType == 'INFINITE') {
    pools = [
      {
        ...pick(data.pools[0], poolCreateAndUpdateFields),
        activationDate: moment(data.pools[0].activationDate).toISOString(),
        permissionGroups: data.pools[0].permissionGroups.map(
          group => group.value
        )
      }
    ];
  } else if (data.eventStatusType == 'NORMAL') {
    pools = data.pools.map(pool => ({
      ...pick(pool, poolCreateAndUpdateFields),
      activationDate: moment(pool.activationDate).toISOString(),
      permissionGroups: pool.permissionGroups.map(group => group.value)
    }));
  }
  return pools;
};

/* Calculte and convert to payment due date
 * @param paymentDueDate: date from form
 */
const calcualtePaymentDueDate = data =>
  data.isPriced ? moment(data.paymentDueDate).toISOString() : null;

/* Calcualte and convert the registation deadline
 * @param unregistationDeadline: data from form
 */
const calculateUnregistrationDeadline = data =>
  data.unregistrationDeadline
    ? moment(data.unregistrationDeadline).toISOString()
    : null;

/* Calculate the merge time for the pools. Only set if there are more then one pool
 * @param mergeTime: date from form
 */
const calculateMergeTime = data =>
  data.pools.length > 1 ? moment(data.mergeTime).toISOString() : null;

// Takes the full data-object and input and transforms the event to the API format.
export const transformEvent = (data: TransformEvent) => ({
  ...pick(data, eventCreateAndUpdateFields),
  startTime: moment(data.startTime).toISOString(),
  endTime: moment(data.endTime).toISOString(),
  mergeTime: calculateMergeTime(data),
  company: data.company && data.company.value,
  eventStatusType: data.eventStatusType,
  responsibleGroup: data.responsibleGroup && data.responsibleGroup.value,
  priceMember: calculatePrice(data),
  location: calculateLocation(data),
  paymentDueDate: calcualtePaymentDueDate(data),
  unregistrationDeadline: calculateUnregistrationDeadline(data),
  pools: calcualtePools(data)
});

export const paymentPending = 'pending';
export const paymentSuccess = 'succeeded';
export const paymentFailure = 'failed';
export const paymentManual = 'manual';

const paymentSuccessMappings = {
  [paymentManual]: true,
  [paymentSuccess]: true,
  [paymentPending]: false,
  [paymentFailure]: false
};

export const hasPaid = (chargeStatus: string) =>
  paymentSuccessMappings[chargeStatus];

export const addStripeFee = (price: number) => Math.ceil(price * 1.012 + 1.8);
