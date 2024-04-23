import { mount } from 'enzyme';
import lolex from 'lolex';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import JoinEventForm from '../JoinEventForm';

vi.useFakeTimers();
const EVENT = {
  id: 1,
  title: 'Big Test Event',
  cover: '',
  description: 'Hello World',
  text: '',
  feedbackDescription: '',
  feedbackRequired: false,
  eventType: 'company_presentation',
  location: 'H3',
  isPriced: true,
  priceMember: 10,
  priceGuest: 10,
  useStripe: false,
  paymentDueDate: null,
  startTime: moment().add(7, 'days'),
  endTime: moment().add(8, 'days'),
  mergeTime: null,
  useCaptcha: true,
  tags: [],
  registrationDeadlineHours: 2,
  registrationCloseTime: moment().add(2, 'hours'),
  unregistrationDeadlineHours: 2,
  unregistrationDeadline: moment().add(10, 'days'),
  pinned: false,
  actionGrant: [],
  activationTime: moment().add(1, 'days'),
  activeCapacity: 30,
  registrationCount: 10,
  totalCapacity: 40,
  thumbnail: null,
  company: {},
  comments: [],
  pools: [],
};
const defaultProps = {
  currentUser: {
    username: 'webkom',
  },
  registration: null,
  event: EVENT,
  formOpen: false,
  captchaOpen: false,
  buttonOpen: false,
  registrationOpensIn: null,
  pendinRegistration: null,
  registrationPending: null,
};
const store = configureStore([])({
  theme: {
    theme: 'light',
  },
  auth: {},
  users: {
    entities: {},
  },
  events: {
    fetching: false,
  },
  penalties: {
    ids: [],
  },
});

function renderJoinEventForm(props = {}) {
  return mount(
    <MemoryRouter>
      <Provider store={store}>
        <JoinEventForm {...defaultProps} {...props} />
      </Provider>
    </MemoryRouter>,
  );
}

describe('<JoinEventForm />', () => {
  let clock;
  beforeEach(() => {
    clock = lolex.install();
  });
  afterEach(() => {
    clock.uninstall();
  });
  it('should start with hidden form', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        startTime: moment().add(7, 'days'),
        activationTime: moment().add(20, 'minutes'),
      },
    }).find('JoinEventForm');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: false,
        registrationOpensIn: null,
      }),
    );
  });
  it('should enable form when 10 minute is left', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(10, 'minutes'),
      },
    }).find('JoinEventForm');

    /**
     * registrationOpensIn is 10:01 by intention due to we dont show 00:00
     * We go directly from 00:01 to "Meld deg på"
     */
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: true,
        registrationOpensIn: '10:01',
      }),
    );
  });
  it('should enable everything but the join button when 1 minute is left', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(1, 'minutes'),
      },
    }).find('JoinEventForm');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: '01:01',
      }),
    );
  });
  /*
    * Broken since enzyme is dead, and the react-18 adapter is not really production quality
    *
  it('should enable everything when countdown is done', () => {
    const activationTime = moment().add(1, 'minutes');
    const view = renderJoinEventForm({
      ...defaultProps,
      event: { ...defaultProps.event, activationTime },
    });
    clock.tick('00:58');
    view.update();
    expect(view.find('JoinEventForm').props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: '00:02',
      })
    );
    clock.tick('00:02');
    view.update();
    expect(view.find('JoinEventForm').props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null,
      })
    );
  });
  */
  it('should enable everything when activationTime is in the past', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().subtract(1, 'seconds'),
      },
    }).find('JoinEventForm');
    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null,
      }),
    );
  });
});
