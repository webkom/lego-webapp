import { mount } from 'enzyme';
import moment from 'moment-timezone';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRegistrationCountdown } from '~/pages/(migrated)/events/@eventIdOrSlug/useRegistrationCountdown';
import { EventType } from '~/redux/models/Event';
import type { EventRegistration } from 'app/models';
import type { UserDetailedEvent } from '~/redux/models/Event';

const EVENT: UserDetailedEvent = {
  canEditGroups: [],
  canEditUsers: [],
  canViewGroups: [],
  contentTarget: 'events.event-1',
  coverPlaceholder: '',
  createdBy: undefined,
  eventStatusType: '',
  heedPenalties: false,
  isForeignLanguage: false,
  isMerged: false,
  legacyRegistrationCount: 0,
  mazemapPoi: undefined,
  pendingRegistration: undefined,
  requireAuth: false,
  responsibleGroup: undefined,
  responsibleUsers: [],
  slug: '',
  survey: undefined,
  unregistrationCloseTime: undefined,
  useConsent: false,
  waitingRegistrationCount: undefined,
  youtubeUrl: '',
  id: 1,
  title: 'Big Test Event',
  cover: '',
  description: 'Hello World',
  text: '',
  feedbackDescription: '',
  feedbackRequired: false,
  eventType: EventType.COMPANY_PRESENTATION,
  location: 'H3',
  isPriced: true,
  priceMember: 10,
  priceGuest: 10,
  useStripe: false,
  paymentDueDate: undefined,
  startTime: moment().add(7, 'days'),
  endTime: moment().add(8, 'days'),
  mergeTime: undefined,
  useCaptcha: true,
  tags: [],
  registrationDeadlineHours: 2,
  registrationCloseTime: moment().add(2, 'hours'),
  unregistrationDeadlineHours: 2,
  unregistrationDeadline: moment().add(10, 'days'),
  activationTime: moment().add(1, 'days'),
  activeCapacity: 30,
  registrationCount: 10,
  spotsLeft: 20,
  company: {
    id: 1,
    name: 'Netcompany',
    logo: '',
    active: true,
  },
  comments: [],
  pools: [],
  price: 0,
  isAdmitted: false,
  following: false,
  photoConsents: [],
};

const CountdownComponent = ({
  event = EVENT,
  registration,
}: {
  event?: UserDetailedEvent;
  registration?: EventRegistration;
}) => {
  const props = useRegistrationCountdown(event, registration);
  return <PropChecker {...props} />;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- we need to check the props in the tests
const PropChecker = (props: ReturnType<typeof useRegistrationCountdown>) => {
  return null;
};

describe('useRegistrationCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should start with hidden form', () => {
    const component = mount(
      <CountdownComponent
        event={{
          ...EVENT,
          activationTime: moment().add(20, 'minutes'),
        }}
      />,
    ).find('PropChecker');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: false,
        registrationOpensIn: moment.duration(20, 'minutes'),
      }),
    );
  });
  it('should enable form when 10 minute is left', () => {
    const component = mount(
      <CountdownComponent
        event={{
          ...EVENT,
          activationTime: moment().add(10, 'minutes'),
        }}
      />,
    ).find('PropChecker');

    /**
     * registrationOpensIn is 10:01 by intention due to we dont show 00:00
     * We go directly from 00:01 to "Meld deg på"
     */
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: true,
        registrationOpensIn: moment.duration(10, 'minutes'),
      }),
    );
  });
  it('should enable everything but the join button when 1 minute is left', () => {
    const component = mount(
      <CountdownComponent
        event={{
          ...EVENT,
          activationTime: moment().add(1, 'minutes'),
        }}
      />,
    ).find('PropChecker');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: moment.duration(1, 'minutes'),
      }),
    );
  });
  it('should enable everything when activationTime is in the past', () => {
    const component = mount(
      <CountdownComponent
        event={{
          ...EVENT,
          activationTime: moment().subtract(1, 'seconds'),
        }}
      />,
    ).find('PropChecker');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null,
      }),
    );
  });
  // TODO: Fix this test (vi.advanceTimersByTime is not working)
  it.skip('should update when time passes', () => {
    const view = mount(
      <CountdownComponent
        event={{
          ...EVENT,
          activationTime: moment().add(19, 'minutes'),
        }}
      />,
    );

    expect(view.find('PropChecker').props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: false,
        registrationOpensIn: moment.duration(19, 'minutes'),
      }),
    );

    vi.advanceTimersByTime(10 * 60 * 1000);
    // 9 minutes until activation
    view.update();

    expect(view.find('PropChecker').props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: true,
        registrationOpensIn: moment.duration(9, 'minutes'),
      }),
    );

    vi.advanceTimersByTime(8 * 60 * 1000);
    // 1 minute until activation
    view.update();

    expect(view.find('PropChecker').props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: moment.duration(1, 'minutes'),
      }),
    );

    vi.advanceTimersByTime(2 * 60 * 1000);
    // Activated
    view.update();

    expect(view.find('PropChecker').props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null,
      }),
    );
  });
});
