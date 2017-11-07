// @flow

import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import lolex from 'lolex';
import JoinEventFormCountdownProvider from '../JoinEventFormCountdownProvider';

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
  registration: null,
  event: EVENT
};

function renderJoinEventFormCountdownProvider(props = {}) {
  return mount(<JoinEventFormCountdownProvider {...defaultProps} {...props} />);
}

describe('<JoinEventFormCountdownProvider />', () => {
  let clock;
  beforeEach(() => {
    clock = lolex.install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  it('should start with hidden form', () => {
    const component = renderJoinEventFormCountdownProvider({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        startTime: moment().add(7, 'days'),
        activationTime: moment().add(20, 'minutes')
      }
    });

    expect(component.state()).toEqual({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: false,
      registrationOpensIn: null
    });
  });

  it('should enable form when 10 minute is left', () => {
    const component = renderJoinEventFormCountdownProvider({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(10, 'minutes')
      }
    });

    /**
     * registrationOpensIn is 10:01 by intention due to we dont show 00:00
     * We go directly from 00:01 to "Meld deg på"
     */
    expect(component.state()).toEqual({
      buttonOpen: false,
      captchaOpen: false,
      formOpen: true,
      registrationOpensIn: '10:01'
    });
  });

  it('should enable everything but the join button when 1 minute is left', () => {
    const component = renderJoinEventFormCountdownProvider({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(1, 'minutes')
      }
    });

    expect(component.state()).toEqual({
      buttonOpen: false,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: '01:01'
    });
  });

  it('should enable everything when countdown is done', () => {
    const component = renderJoinEventFormCountdownProvider({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().add(1, 'minutes')
      }
    });

    clock.tick('00:59');

    expect(component.state()).toEqual({
      buttonOpen: false,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: '00:02'
    });

    clock.tick('00:02');

    expect(component.state()).toEqual({
      buttonOpen: true,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: null
    });
  });

  it('should enable everything when activationTime is in the past', () => {
    const component = renderJoinEventFormCountdownProvider({
      ...defaultProps,
      event: {
        ...defaultProps.event,
        activationTime: moment().subtract(1, 'seconds')
      }
    });

    expect(component.state()).toEqual({
      buttonOpen: true,
      captchaOpen: true,
      formOpen: true,
      registrationOpensIn: null
    });
  });
});
