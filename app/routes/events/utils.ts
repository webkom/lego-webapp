import { find, sumBy } from 'lodash';
import moment from 'moment-timezone';
import { EventStatusType, EventType } from 'app/store/models/Event';
import type { Dateish, Event, EventSemester } from 'app/models';
import type { CompleteEvent } from 'app/store/models/Event';
import type Penalty from 'app/store/models/Penalty';
import type {
  DetailedUser,
  PhotoConsent,
  PhotoConsentDomain,
} from 'app/store/models/User';

export type ConfigProperties = {
  displayName: string;
  color: string;
  textColor: string;
};

export const EventTypeConfig: Record<EventType, ConfigProperties> = {
  [EventType.COMPANY_PRESENTATION]: {
    displayName: 'Bedriftspresentasjon',
    color: '#A1C34A',
    textColor: '#000',
  },
  [EventType.COURSE]: {
    displayName: 'Kurs',
    color: '#52B0EC',
    textColor: '#000',
  },
  [EventType.PARTY]: {
    displayName: 'Fest',
    color: '#FCD748',
    textColor: '#000',
  },
  [EventType.SOCIAL]: {
    displayName: 'Sosialt',
    color: 'var(--color-event-red)',
    textColor: '#FFF',
  },
  [EventType.BREAKFAST_TALK]: {
    displayName: 'Frokostforedrag',
    color: '#86D1D0',
    textColor: '#000',
  },
  [EventType.LUNCH_PRESENTATION]: {
    displayName: 'Lunsjpresentasjon',
    color: '#A1C34A',
    textColor: '#000',
  },
  [EventType.EVENT]: {
    displayName: 'Arrangement',
    color: 'var(--color-event-red)',
    textColor: '#FFF',
  },
  [EventType.ALTERNATIVE_PRESENTATION]: {
    displayName: 'Alternativ bedpres',
    color: '#8A2BE2',
    textColor: '#FFF',
  },
  [EventType.NEXUS_EVENT]: {
    displayName: 'NEXUS-arrangement',
    color: '#00509E',
    textColor: 'var(--color-absolute-white)',
  },
  [EventType.OTHER]: {
    displayName: 'Annet',
    color: 'var(--color-event-black)',
    textColor: 'var(--color-white)',
  },
};

// Returns the string representation of an EventType
export const displayNameForEventType = (eventType: EventType) => {
  return (
    EventTypeConfig[eventType]?.displayName ||
    EventTypeConfig[EventType.OTHER].displayName
  );
};

// Returns the color code of an EventType
export const colorForEventType = (eventType: EventType = EventType.OTHER) => {
  return EventTypeConfig[eventType]?.color;
};

// Returns a color that is appropriate to be used for text put on top of a background with the color code of an EventType
export const textColorForEventType = (eventType: EventType) => {
  return (
    EventTypeConfig[eventType]?.textColor ||
    EventTypeConfig[EventType.OTHER].textColor
  );
};

type Option<T = string, K = string> = { label: T; value: K };

export type EditingEvent = Event & {
  eventType: EventType;
  company: Option;
  responsibleGroup: Option;
  isGroupOnly: boolean;
  mazemapPoi: Option<string, number>;
  useMazemap: boolean;
  eventStatusType: Option<string, EventStatusType>;
  registrationDeadline: Dateish;
  hasFeedbackQuestion: boolean;
  isClarified: boolean;
  authors: Option[];
  responsibleUsers: DetailedUser[];
  saveToImageGallery: boolean;
};

export const registrationCloseTime = (
  event: Pick<CompleteEvent, 'startTime' | 'registrationDeadlineHours'>,
) => moment(event.startTime).subtract(event.registrationDeadlineHours, 'hours');

export const registrationIsClosed = (
  event: Pick<CompleteEvent, 'startTime' | 'registrationDeadlineHours'>,
) => {
  return moment().isAfter(registrationCloseTime(event));
};

export const sumPenalties = (penalties: Penalty[]) =>
  sumBy(penalties, 'weight');
export const penaltyHours = (penalties: Penalty[]) => {
  switch (sumPenalties(penalties)) {
    case 0:
      return 0;

    case 1:
      return 3;

    case 2:
      return 12;

    case 3:
      return 1337;

    default:
      return 0;
  }
};

export const eventStatusTypes: { value: EventStatusType; label: string }[] = [
  {
    value: EventStatusType.TBA,
    label: 'Ikke bestemt (TBA)',
  },
  {
    value: EventStatusType.NORMAL,
    label: 'Vanlig påmelding (med pools)',
  },
  {
    value: EventStatusType.OPEN,
    label: 'Åpen (uten påmelding)',
  },
  {
    value: EventStatusType.INFINITE,
    label: 'Åpen (med påmelding)',
  },
];

export const transformEventStatusType = (eventStatusType: EventStatusType) => {
  return (
    find(eventStatusTypes, {
      value: eventStatusType,
    }) || eventStatusTypes[0]
  );
};

export const getEventSemesterFromStartTime = (
  startTime: Dateish,
): EventSemester => {
  return {
    year: moment(startTime).year(),
    semester: moment(startTime).month() > 6 ? 'autumn' : 'spring',
  };
};

export const getConsent = (
  domain: PhotoConsentDomain,
  year: number,
  semester: string,
  photoConsents: PhotoConsent[],
): PhotoConsent | null | undefined =>
  photoConsents.find(
    (pc) =>
      pc.domain === domain && pc.year === year && pc.semester === semester,
  );

export const allConsentsAnswered = (photoConsents: PhotoConsent[]): boolean =>
  photoConsents?.reduce(
    (all_bool, pc) => all_bool && typeof pc.isConsenting === 'boolean',
    photoConsents.length > 0,
  );

export const toReadableSemester = (
  semesterObj: EventSemester | PhotoConsent,
): string => {
  const semester = semesterObj.semester === 'spring' ? 'våren' : 'høsten';
  return `${semester} ${semesterObj.year}`;
};

export const containsAllergier = (value) =>
  value && value.toLowerCase().indexOf('allergi') !== -1
    ? `Matallergier / preferanser kan hentes fra adminsidene til arrangementet`
    : undefined;

export const tooLow = (value) =>
  value && value <= 3 ? `Summen må være større enn 3 kr` : undefined;
