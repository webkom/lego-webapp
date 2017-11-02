// @flow
import { pick } from 'lodash';
import moment from 'moment-timezone';
import type { TransformEvent, EventType } from 'app/models';

export const time = (
  timeObject: { days?: number, hours?: number, minutes?: number } = {}
) =>
  moment()
    .startOf('day')
    .add(timeObject)
    .toISOString();

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
  'pinned'
];

const poolCreateAndUpdateFields = [
  'id',
  'name',
  'capacity',
  'activationDate',
  'permissionGroups'
];

export const transformEvent = (data: TransformEvent, edit: boolean = false) => {
  return {
    ...pick(data, eventCreateAndUpdateFields),
    startTime: moment(data.startTime).toISOString(),
    endTime: moment(data.endTime).toISOString(),
    mergeTime: moment(data.mergeTime).toISOString(),
    company: data.company && data.company.value,
    priceMember: data.isPriced ? data.priceMember * 100 : 0,
    paymentDueDate: moment(data.paymentDueDate).toISOString(),
    unregistrationDeadline: moment(data.unregistrationDeadline).toISOString(),
    pools: data.pools.map(pool => ({
      ...pick(pool, poolCreateAndUpdateFields),
      activationDate: moment(pool.activationDate).toISOString(),
      permissionGroups: pool.permissionGroups.map(group => group.value)
    }))
  };
};
