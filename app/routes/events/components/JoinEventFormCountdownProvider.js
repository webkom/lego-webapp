// @flow

import { Component, type Node } from 'react';
import moment from 'moment-timezone';
import type { Dateish, Event, EventRegistration } from 'app/models';

type Action =
  | 'REGISTRATION_AVAILABLE'
  | '1_MINUTE_LEFT'
  | 'STILL_WAITING'
  | 'REGISTERED_OR_REGISTRATION_ALREADY_OPENED'
  | 'REGISTRATION_NOT_AVAILABLE'
  | 'RESET';

export type Props = {
  event: Event,
  registration: ?EventRegistration,
  render?: (state: State) => Node
};

const COUNTDOWN_STARTS_WHEN_MINUTES_LEFT = 10;

// How often to check when to start the real countdown
const CHECK_COUNTDOWN_START_INTERVAL = 10000;

// How often to run the countdown, should be <= 1000
const COUNTDOWN_INTERVAL = 1000;

// Must be sorted lo->hi
const TICK_ACTIONS: Array<[number, Action]> = [
  [0, 'REGISTRATION_AVAILABLE'],
  [60 * 1000, '1_MINUTE_LEFT'],
  [Infinity, 'STILL_WAITING']
];

type State = {
  formOpen: boolean,
  captchaOpen: boolean,
  buttonOpen: boolean
};

class JoinEventFormCountdownProvider extends Component<Props, State> {
  state = {
    formOpen: false,
    captchaOpen: false,
    buttonOpen: false
  };

  countdownProbeTimer: number;
  countdownTimer: number;

  reducer = (state: State, action: Action): State => {
    switch (action) {
      case 'REGISTRATION_AVAILABLE':
        return {
          buttonOpen: true,
          formOpen: true,
          captchaOpen: true
        };

      case '1_MINUTE_LEFT':
        return {
          captchaOpen: true,
          formOpen: true,
          buttonOpen: false
        };

      case 'REGISTERED_OR_REGISTRATION_ALREADY_OPENED':
        return {
          formOpen: true,
          captchaOpen: true,
          buttonOpen: true
        };

      case 'REGISTRATION_NOT_AVAILABLE':
        return {
          ...state,
          formOpen: true
        };

      case 'RESET':
        return {
          formOpen: false,
          captchaOpen: false,
          buttonOpen: false
        };

      default:
        return state;
    }
  };

  componentDidMount() {
    this.setupEventCountdown(this.props.event, this.props.registration);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      (nextProps.event.activationTime && !this.props.event.activationTime) ||
      nextProps.registration !== this.props.registration
    ) {
      this.dispatch('RESET');
      this.setupEventCountdown(nextProps.event, nextProps.registration);
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdownProbeTimer);
    clearInterval(this.countdownTimer);
  }

  dispatch(action: Action) {
    this.setState(state => this.reducer(state, action));
  }

  setupEventCountdown = (event: Event, registration: ?EventRegistration) => {
    const { activationTime, startTime } = event;
    const poolActivationTime = moment(activationTime);
    const currentTime = moment();

    // TODO: the 2 hour subtract is a hardcoded close time and should be improved
    const registrationIsClosed = currentTime.isAfter(
      moment(startTime).subtract(2, 'hours')
    );

    if ((!registration && !activationTime) || registrationIsClosed) {
      this.dispatch('REGISTRATION_NOT_AVAILABLE');
      return;
    }

    if (registration || poolActivationTime.isBefore(currentTime)) {
      this.dispatch('REGISTERED_OR_REGISTRATION_ALREADY_OPENED');
      return;
    }

    const timeUntilRegistrationOpens = getTimeUntil(poolActivationTime);

    if (
      timeUntilRegistrationOpens.asMinutes() <=
      COUNTDOWN_STARTS_WHEN_MINUTES_LEFT
    ) {
      this.initiateCountdown(poolActivationTime);
      return;
    }

    const poll = () => {
      const timeUntilRegistrationOpens = getTimeUntil(poolActivationTime);

      if (
        timeUntilRegistrationOpens.asMinutes() <=
        COUNTDOWN_STARTS_WHEN_MINUTES_LEFT
      ) {
        clearInterval(this.countdownProbeTimer);
        this.initiateCountdown(poolActivationTime);
      }
    };

    poll();
    this.countdownProbeTimer = setInterval(
      poll,
      CHECK_COUNTDOWN_START_INTERVAL
    );
  };

  initiateCountdown(finishTime: Dateish) {
    const poll = () => {
      const timeUntilRegistrationOpens = getTimeUntil(finishTime);

      if (timeUntilRegistrationOpens.asMilliseconds() <= 0) {
        clearInterval(this.countdownTimer);
      }

      const [, action] =
        TICK_ACTIONS.find(
          ([time, action]) =>
            timeUntilRegistrationOpens.asMilliseconds() <= time
        ) || [];

      if (action) {
        this.dispatch(action);
      }
    };

    poll();
    this.countdownTimer = setInterval(poll, COUNTDOWN_INTERVAL);
  }

  render() {
    if (this.props.render) {
      return this.props.render(this.state);
    }

    return null;
  }
}

function getTimeDifference(first: moment, second: moment): number {
  return moment(first).diff(moment(second));
}

export function getTimeUntil(
  time: Dateish,
  currentTime?: Dateish = moment()
): moment$MomentDuration {
  return moment.duration(getTimeDifference(time, currentTime));
}

export default JoinEventFormCountdownProvider;
