// @flow

import type { Event } from 'app/models';
import moment from 'moment-timezone';

// Calculate diplay message for an event based on
// eventStatusType, activationTime, capacity and totalCapacity

const eventStatus = (event: Event, pill: boolean = false) => {
  const {
    registrationCount,
    totalCapacity,
    activationTime,
    eventStatusType
  } = event;

  const future = moment().isBefore(activationTime);

  switch (eventStatusType) {
    case 'TBA':
      return 'Mer info kommer';
    case 'OPEN':
      return 'Åpent arrangement';
    case 'INFINITE':
      if (activationTime === null) {
        return 'Ingen påmeldingsrett';
      }
      return 'Åpent med påmelding';
    case 'NORMAL':
      if (activationTime === null) {
        return 'Ingen påmeldingsrett';
      }
      // Check if the event is in the future
      return future
        ? `Åpner ${moment(activationTime).format('dddd D MMM HH:mm')}`
        : pill
        ? false
        : `${registrationCount}/${totalCapacity} påmeldte`;
    default:
      return '';
  }
};

const eventAttendance = (event: Event) => {
  const { registrationCount, totalCapacity, activationTime } = event;

  if (activationTime === null) {
    return false;
  }

  const isFuture = moment().isBefore(activationTime);
  return isFuture
    ? `${totalCapacity} plasser`
    : `${registrationCount} / ${totalCapacity}`;
};

export { eventStatus, eventAttendance };
