

import { Event } from 'app/models';
import moment from 'moment-timezone';

// Calculate diplay message for an event based on
// eventStatusType, activationTime, capacity and totalCapacity

const eventStatus = (event: Event) => {
  const {
    registrationCount,
    totalCapacity,
    activationTime,
    eventStatusType
  } = event;

  // Check if the event is in the future
  const future = moment().isBefore(activationTime);

  switch (eventStatusType) {
    case 'TBA':
      return 'Mer info kommer';
    case 'OPEN':
      return 'Åpent arrangement';
    case 'INFINITE':
      return 'Åpent med påmelding';
    case 'NORMAL':
      return future
        ? `Åpner ${moment(activationTime).format('dddd D MMM HH:mm')}`
        : `${registrationCount}/${totalCapacity} påmeldte`;
    default:
      return '';
  }
};

export default eventStatus;
