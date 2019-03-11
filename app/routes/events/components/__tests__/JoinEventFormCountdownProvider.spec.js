// @flow

import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import moment from 'moment';
import lolex from 'lolex';
import JoinEventForm from '../JoinEventForm';
import configureStore from 'redux-mock-store';

jest.useFakeTimers();

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
  pools: []
};

const defaultProps = {
  currentUser: { username: 'webkom' },
  registration: null,
  event: EVENT
};
const store = configureStore([])({});

function renderJoinEventForm(props = {}) {
  return mount(
    <Provider store={store}>
      {/* // $FlowFixMe */}
      <JoinEventForm {...defaultProps} {...props} />
    </Provider>
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
        activationTime: moment().add(20, 'minutes')
      }
    }).find('JoinEventForm');

    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: false,
        formOpen: false,
        registrationOpensIn: null
      })
    );
  });

  it('should enable form when 10 minute is left', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(10, 'minutes')
      }
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
        registrationOpensIn: '10:01'
      })
    );
  });

  it('should enable everything but the join button when 1 minute is left', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(1, 'minutes')
      }
    }).find('JoinEventForm');

    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: '01:01'
      })
    );
  });

  it('should enable everything when countdown is done', () => {
    const activationTime = moment().add(1, 'minutes');
    let component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime
      }
    });

    clock.tick('00:59');

    component.update();
    expect(component.find('JoinEventForm').props()).toEqual(
      expect.objectContaining({
        buttonOpen: false,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: '00:02'
      })
    );

    clock.tick('00:02');

    component.update();
    expect(component.find('JoinEventForm').props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null
      })
    );
  });

  it('should enable everything when activationTime is in the past', () => {
    const component = renderJoinEventForm({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().subtract(1, 'seconds')
      }
    }).find('JoinEventForm');

    expect(component.props()).toEqual(
      expect.objectContaining({
        buttonOpen: true,
        captchaOpen: true,
        formOpen: true,
        registrationOpensIn: null
      })
    );
  });
});
