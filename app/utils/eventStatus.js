// @flow

import type { Event } from 'app/models';
import moment from 'moment-timezone';

// Calculate diplay message for an event based on
// eventStatusType, activationTime, capacity and totalCapacity
const eventStatus = (
  event: Event,
  loggedIn: boolean = false,
  isPill: boolean = false
): string | boolean => {
  const {
    registrationCount,
    totalCapacity,
    activationTime,
    isAdmitted,
    eventStatusType,
  } = event;

  const future = moment().isBefore(activationTime);

  switch (eventStatusType) {
    case 'TBA':
      return 'Mer info kommer';
    case 'OPEN':
      return 'Åpent arrangement';
    case 'NORMAL':
    case 'INFINITE':
      // Check if event has been
      if (event.startTime < moment()) {
        return `${registrationCount}/${totalCapacity} påmeldte`;
      }
      if (!loggedIn) {
        return 'Logg inn for å melde deg på';
      } else if (activationTime === null) {
        if (isAdmitted) {
          return 'Du er påmeldt';
        }
        return 'Ingen påmeldingsrett';
      }

      // Check if the event is in the future
      if (future) {
        return `Åpner ${moment(activationTime).format('dddd D MMM HH:mm')}`;
      }
      if (eventStatusType === 'INFINITE') {
        return 'Åpent med påmelding';
      }
      return isPill ? false : `${registrationCount}/${totalCapacity} påmeldte`;
    default:
      return '';
  }
};

const eventAttendance = (event: Event): string | boolean => {
  const { registrationCount, totalCapacity, activationTime, isAdmitted } =
    event;

  if (!isAdmitted && activationTime === null) {
    return false;
  }

  const isFuture = moment().isBefore(activationTime);
  return isFuture && !isAdmitted
    ? `${totalCapacity} plasser`
    : `${registrationCount} / ${totalCapacity}`;
};

export { eventStatus, eventAttendance };
