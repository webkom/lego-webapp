// Takes the full data-object and input and transforms the event to the API format.
import { pick } from 'lodash';
import moment from 'moment-timezone';
import config from 'app/config';
import type { EventEditorFormValues } from 'app/routes/events/components/EventEditor/index';

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

export const transformEvent = (data: EventEditorFormValues) => ({
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

/* Calculate the event price
 * @param isPriced: If the event is priced
 */
const calculatePrice = (data: EventEditorFormValues) =>
  data.isPriced ? data.priceMember * 100 : 0;

/* Calculate the event location
 * @param eventStatusType: what kind of registrationmode this event has
 */
const calculateLocation = (data: EventEditorFormValues) =>
  data.useMazemap ? data.mazemapPoi?.label : data.location;

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
const calculatePools = (data: EventEditorFormValues) => {
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
            (group) => group.value,
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
const calculatePaymentDueDate = (data: EventEditorFormValues) =>
  data.isPriced ? moment(data.paymentDueDate).toISOString() : null;

/* Calcualte and convert the registation deadline
 * @param unregistationDeadline: data from form
 */
const calculateUnregistrationDeadline = (data: EventEditorFormValues) =>
  data.unregistrationDeadline
    ? moment(data.unregistrationDeadline).toISOString()
    : null;

const calculateUnregistrationDeadlineHours = (data: EventEditorFormValues) =>
  data.separateDeadlines
    ? data.unregistrationDeadlineHours
    : data.registrationDeadlineHours;

/* Calculate the merge time for the pools. Only set if there are more then one pool
 * @param mergeTime: date from form
 */
const calculateMergeTime = (data: EventEditorFormValues) =>
  data.pools.length > 1 ? moment(data.mergeTime).toISOString() : null;
