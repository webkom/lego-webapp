import { pick, sumBy, find } from 'lodash';
import moment from 'moment-timezone';
import config from 'app/config';
import type {
  TransformEvent,
  Event,
  AddPenalty,
  PhotoConsent,
  PhotoConsentDomain,
  EventSemester,
  Dateish,
  EventStatusType,
} from 'app/models';
import type { EventType } from 'app/store/models/Event';
import type { DetailedUser } from 'app/store/models/User';

// Current eventTypes
export const EVENT_CONSTANTS: Record<EventType, string> = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  alternative_presentation: 'Alternativ bedpres',
  course: 'Kurs',
  breakfast_talk: 'Frokostforedrag',
  party: 'Fest',
  social: 'Sosialt',
  event: 'Arrangement',
  kid_event: 'KiD-arrangement',
  other: 'Annet',
} as const;

// Returns the string representation of an EventType
export const eventTypeToString = (eventType: EventType): string => {
  return EVENT_CONSTANTS[eventType] || EVENT_CONSTANTS['other'];
};
// Colors for different event types
const COLOR_CONSTANTS: Record<EventType, string> = {
  company_presentation: '#A1C34A',
  lunch_presentation: '#A1C34A',
  alternative_presentation: '#8A2BE2',
  course: '#52B0EC',
  breakfast_talk: '#86D1D0',
  party: '#FCD748',
  social: 'var(--color-event-red)',
  event: 'var(--color-event-red)',
  kid_event: 'var(--color-event-black)',
  other: 'var(--color-event-black)',
} as const;
// Returns the color code of an EventType
export const colorForEvent = (eventType: EventType) => {
  return COLOR_CONSTANTS[eventType] || COLOR_CONSTANTS['other'];
};

// Hard-coded text colors for different event types
const TEXT_COLOR_CONSTANTS: Record<EventType, string> = {
  company_presentation: '#000',
  lunch_presentation: '#000',
  alternative_presentation: '#FFF',
  course: '#000',
  breakfast_talk: '#000',
  party: '#000',
  social: '#FFF',
  event: '#FFF',
  kid_event: 'var(--color-white)',
  other: 'var(--color-white)',
} as const;
// Returns a color that is appropriate to be used for text put on top of a background with the color code of an EventType
export const textColorForEvent = (eventType: EventType) => {
  return TEXT_COLOR_CONSTANTS[eventType] || TEXT_COLOR_CONSTANTS['other'];
};

type Option<T = string, K = string> = { label: T; value: K };

export type EditingEvent = Event & {
  eventType: Option<
    (typeof EVENT_CONSTANTS)[keyof typeof EVENT_CONSTANTS],
    EventType
  >;
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
  'useContactTracing',
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

export const sumPenalties = (penalties: Array<AddPenalty>) =>
  sumBy(penalties, 'weight');
export const penaltyHours = (penalties: Array<AddPenalty>) => {
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
