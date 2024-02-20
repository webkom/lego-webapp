import { pick, sumBy, find } from 'lodash';
import moment from 'moment-timezone';
import config from 'app/config';
import { EventType } from 'app/store/models/Event';
import type {
  Event,
  TransformEvent,
  PhotoConsent,
  PhotoConsentDomain,
  EventSemester,
  Dateish,
  EventStatusType,
} from 'app/models';
import type Penalty from 'app/store/models/Penalty';
import type { DetailedUser } from 'app/store/models/User';

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
  [EventType.KiD_EVENT]: {
    displayName: 'KiD-arrangement',
    color: 'var(--color-event-black)',
    textColor: 'var(--color-white)',
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
  'registrationDeadlineHours',
  'pinned',
  'heedPenalties',
  'useConsent',
  'separateDeadlines',
  'responsibleUsers',
];
// Pool fields that should be created or updated based on the API
const poolCreateAndUpdateFields = [
  'id',
  'name',
  'capacity',
  'activationDate',
  'permissionGroups',
];

/* Calculate the event price
 * @param isPriced: If the event is priced
 */
const calculatePrice = (data) => (data.isPriced ? data.priceMember * 100 : 0);

/* Calculate the event location
 * @param eventStatusType: what kind of registrationmode this event has
 */
const calculateLocation = (data) =>
  data.useMazemap ? data.mazemapPoi.label : data.location;

const calculateMazemapPoi = (data) => {
  if (!data.useMazemap || data.mazemapPoi.value === '') {
    return null;
  }

  return data.mazemapPoi.value;
};

/* Calculate the event pools
 * @param eventStatusType: what kind of registrationmode this event has
 * @param pools: the event groups as specified by the CreateEvent forms
 */
const calculatePools = (data) => {
  switch (data.eventStatusType?.value) {
    case 'TBA':
    case 'OPEN':
      return [];

    case 'INFINITE':
      return [
        {
          ...pick(data.pools[0], poolCreateAndUpdateFields),
          activationDate: moment(data.pools[0].activationDate).toISOString(),
          permissionGroups: data.pools[0].permissionGroups.map(
            (group) => group.value
          ),
        },
      ];

    case 'NORMAL':
      return data.pools.map((pool) => ({
        ...pick(pool, poolCreateAndUpdateFields),
        activationDate: moment(pool.activationDate).toISOString(),
        permissionGroups: pool.permissionGroups.map((group) => group.value),
      }));

    default:
      break;
  }
};

/* Calculte and convert to payment due date
 * @param paymentDueDate: date from form
 */
const calculatePaymentDueDate = (data) =>
  data.isPriced ? moment(data.paymentDueDate).toISOString() : null;

/* Calcualte and convert the registation deadline
 * @param unregistationDeadline: data from form
 */
const calculateUnregistrationDeadline = (data) =>
  data.unregistrationDeadline
    ? moment(data.unregistrationDeadline).toISOString()
    : null;

const calculateUnregistrationDeadlineHours = (data) =>
  data.separateDeadlines
    ? data.unregistrationDeadlineHours
    : data.registrationDeadlineHours;

/* Calculate the merge time for the pools. Only set if there are more then one pool
 * @param mergeTime: date from form
 */
const calculateMergeTime = (data) =>
  data.pools.length > 1 ? moment(data.mergeTime).toISOString() : null;

// Takes the full data-object and input and transforms the event to the API format.
export const transformEvent = (data: TransformEvent) => ({
  ...pick(data, eventCreateAndUpdateFields),
  startTime: moment(data.startTime).toISOString(),
  endTime: moment(data.endTime).toISOString(),
  mergeTime: calculateMergeTime(data),
  company: data.company && data.company.value,
  eventStatusType: data.eventStatusType && data.eventStatusType.value,
  eventType: data.eventType && data.eventType.value,
  responsibleGroup: data.responsibleGroup && data.responsibleGroup.value,
  responsibleUsers: data.responsibleUsers
    ? data.responsibleUsers.map((user) => user.value)
    : [],
  priceMember: calculatePrice(data),
  location: calculateLocation(data),
  paymentDueDate: calculatePaymentDueDate(data),
  canViewGroups: data.isGroupOnly
    ? data.canViewGroups.map((group) => group.id)
    : [],
  requireAuth: data.canViewGroups.length > 0,
  unregistrationDeadline: calculateUnregistrationDeadline(data),
  unregistrationDeadlineHours: calculateUnregistrationDeadlineHours(data),
  pools: calculatePools(data),
  useCaptcha: config.environment === 'ci' ? false : data.useCaptcha,
  youtubeUrl: data.youtubeUrl,
  mazemapPoi: calculateMazemapPoi(data),
  feedbackDescription:
    (data.hasFeedbackQuestion && data.feedbackDescription) || '',
  feedbackRequired: data.hasFeedbackQuestion && data.feedbackRequired,
  isForeignLanguage: data.isForeignLanguage,
});
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
  [paymentFailure]: false,
};
export const hasPaid = (paymentStatus: string) =>
  paymentSuccessMappings[paymentStatus];

export const registrationCloseTime = (event: Event) =>
  moment(event.startTime).subtract(event.registrationDeadlineHours, 'hours');

export const registrationIsClosed = (event: Event) => {
  return moment().isAfter(registrationCloseTime(event));
};

export const unregistrationCloseTime = (event: Event) =>
  moment(event.startTime).subtract(event.unregistrationDeadlineHours, 'hours');
export const unregistrationIsClosed = (event: Event) => {
  return moment().isAfter(unregistrationCloseTime(event));
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

export const eventStatusTypes = [
  {
    value: 'TBA',
    label: 'Ikke bestemt (TBA)',
  },
  {
    value: 'NORMAL',
    label: 'Vanlig påmelding (med pools)',
  },
  {
    value: 'OPEN',
    label: 'Åpen (uten påmelding)',
  },
  {
    value: 'INFINITE',
    label: 'Åpen (med påmelding)',
  },
];

export const transformEventStatusType = (eventStatusType: string) => {
  return (
    find(eventStatusTypes, {
      value: eventStatusType,
    }) || eventStatusTypes[0]
  );
};

export const getEventSemesterFromStartTime = (
  startTime: Dateish
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
  photoConsents: Array<PhotoConsent>
): PhotoConsent | null | undefined =>
  photoConsents.find(
    (pc) => pc.domain === domain && pc.year === year && pc.semester === semester
  );

export const allConsentsAnswered = (
  photoConsents: Array<PhotoConsent>
): boolean =>
  photoConsents?.reduce(
    (all_bool, pc) => all_bool && typeof pc.isConsenting === 'boolean',
    photoConsents.length > 0
  );

export const toReadableSemester = (
  semesterObj: EventSemester | PhotoConsent
): string => {
  const semester = semesterObj.semester === 'spring' ? 'våren' : 'høsten';
  return `${semester} ${semesterObj.year}`;
};

export const isTBA = (value) =>
  value && value === 'TBA' ? `Velg påmeldingstype TBA` : undefined;

export const containsAllergier = (value) =>
  value && value.toLowerCase().indexOf('allergi') !== -1
    ? `Matallergier/preferanser kan hentes fra adminsidene til arrangementet`
    : undefined;

export const tooLow = (value) =>
  value && value <= 3 ? `Summen må være større enn 3 kr` : undefined;
