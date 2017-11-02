import { omit } from 'lodash';
import moment from 'moment-timezone';

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

export const EVENT_TYPE_TO_STRING = eventType => {
  return eventTypes[eventType] || eventTypes['other'];
};

const TYPE_COLORS = {
  company_presentation: '#A1C34A',
  lunch_presentation: '#A1C34A',
  course: '#52B0EC',
  party: '#FCD748',
  social: '#B11C11',
  event: '#B11C11',
  other: '#111'
};

export const colorForEvent = eventType => {
  return TYPE_COLORS[eventType] || TYPE_COLORS['other'];
};

export const transformEvent = (data, edit = false) => {
  return {
    ...data,
    startTime: moment(data.startTime).toISOString(),
    endTime: moment(data.endTime).toISOString(),
    mergeTime: moment(data.mergeTime).toISOString(),
    company: data.company && data.company.value,
    priceMember: data.isPriced ? data.priceMember * 100 : 0,
    paymentDueDate: moment(data.paymentDueDate).toISOString(),
    unregistrationDeadline: moment(data.unregistrationDeadline).toISOString(),
    pools: data.pools.map((pool, i) => ({
      ...omit(pool, 'registrations'),
      activationDate: moment(pool.activationDate).toISOString(),
      permissionGroups: pool.permissionGroups.map(group => group.value)
    }))
  };
};
