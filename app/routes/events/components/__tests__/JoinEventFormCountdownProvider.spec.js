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
  description: 'Hello World',
  eventType: 'company_presentation',
  registrationCount: 10,
  totalCapacity: 40,
  activeCapacity: 30,
  startTime: moment().add(7, 'days'),
  activationTime: moment().add(1, 'days'),
  cover: null,
  thumbnail: null,
  location: 'H3',
  useCaptcha: true,
  isPriced: true,
  price: 10
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
      formOpen: false
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
      formOpen: true
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
      formOpen: true
    });

    clock.tick('00:02');

    expect(component.state()).toEqual({
      buttonOpen: true,
      captchaOpen: true,
      formOpen: true
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
      formOpen: true
    });
  });
});
