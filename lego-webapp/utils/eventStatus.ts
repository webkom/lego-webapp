import moment from 'moment-timezone';
import type { CompleteEvent, FrontpageEvent } from '~/redux/models/Event';

// Calculate diplay message for an event based on
// eventStatusType, activationTime, capacity and totalCapacity
const eventStatus = (event: FrontpageEvent, loggedIn = false): string => {
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
      if (moment(event.startTime) > moment()) {
        return `${registrationCount}/${totalCapacity || '∞'} påmeldte`;
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
      return '';
    default:
      return '';
  }
};

const eventAttendanceAbsolute = (
  event: Pick<
    CompleteEvent,
    'registrationCount' | 'totalCapacity' | 'activationTime' | 'eventStatusType'
  >,
): string => {
  const { registrationCount, totalCapacity, activationTime, eventStatusType } =
    event;
  switch (eventStatusType) {
    case 'OPEN':
      return 'Åpent arrangement';
    case 'NORMAL':
    case 'INFINITE': {
      const isFuture = moment().isBefore(activationTime);
      return isFuture
        ? `${totalCapacity} plasser`
        : `${registrationCount} / ${totalCapacity || '∞'}`;
    }
    default:
      return '';
  }
};

export { eventStatus, eventAttendanceAbsolute };
