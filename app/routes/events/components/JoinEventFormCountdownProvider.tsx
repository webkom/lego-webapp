import moment from 'moment-timezone';
import { Component } from 'react';
import { registrationIsClosed } from '../utils';
import type { Dateish, EventRegistration } from 'app/models';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { Duration } from 'moment-timezone';
import type { ComponentType, ReactNode } from 'react';

type Action =
  | 'REGISTRATION_AVAILABLE'
  | '90_SECONDS_LEFT'
  | '10_MINUTE_LEFT'
  | 'STILL_WAITING'
  | 'REGISTERED_OR_REGISTRATION_ALREADY_OPENED'
  | 'REGISTRATION_NOT_AVAILABLE'
  | 'RESET';
type State = {
  formOpen: boolean;
  captchaOpen: boolean;
  buttonOpen: boolean;
  registrationOpensIn: string | null | undefined;
};
export type Props = State & {
  event: UserDetailedEvent | AuthUserDetailedEvent;
  registration: EventRegistration | null | undefined;
  render?: (state: State) => ReactNode;
  pendingRegistration: EventRegistration | null | undefined;
  registrationPending: boolean;
  formOpen: boolean;
  captchaOpen: boolean;
};
const COUNTDOWN_STARTS_WHEN_MINUTES_LEFT = 10;
// How often to check when to start the real countdown
const CHECK_COUNTDOWN_START_INTERVAL = 10000;
// How often to run the countdown, should be <= 1000
const COUNTDOWN_INTERVAL = 1000;
// Must be sorted lo->hi
const TICK_ACTIONS: Array<[number, Action]> = [
  [0, 'REGISTRATION_AVAILABLE'],
  [90 * 1000, '90_SECONDS_LEFT'],
  [60 * 10000, '10_MINUTE_LEFT'],
  [Infinity, 'STILL_WAITING'],
];

const countdownReducer = (
  state: State,
  action: Action,
  registrationOpensIn: string | null | undefined
): State => {
  switch (action) {
    case 'REGISTRATION_AVAILABLE':
      return {
        buttonOpen: true,
        formOpen: true,
        captchaOpen: true,
        registrationOpensIn: null,
      };

    case '90_SECONDS_LEFT':
      return {
        captchaOpen: true,
        formOpen: true,
        buttonOpen: false,
        registrationOpensIn,
      };

    case '10_MINUTE_LEFT':
      return {
        captchaOpen: false,
        formOpen: true,
        buttonOpen: false,
        registrationOpensIn,
      };

    case 'REGISTERED_OR_REGISTRATION_ALREADY_OPENED':
      return {
        formOpen: true,
        captchaOpen: true,
        buttonOpen: true,
        registrationOpensIn: null,
      };

    case 'REGISTRATION_NOT_AVAILABLE':
    case 'RESET':
      return {
        formOpen: false,
        captchaOpen: false,
        buttonOpen: false,
        registrationOpensIn: null,
      };

    default:
      return state;
  }
};

function withCountdown(WrappedComponent: ComponentType<Props>) {
  return class JoinEventFormCountdownProvider extends Component<Props, State> {
    state = {
      formOpen: false,
      captchaOpen: false,
      buttonOpen: false,
      registrationOpensIn: null,
    };
    countdownProbeTimer?: ReturnType<typeof setInterval>;
    countdownTimer?: ReturnType<typeof setInterval>;

    componentDidMount() {
      this.setupEventCountdown(this.props.event, this.props.registration);
    }

    // eslint-disable-next-line
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

    dispatch(action: Action, registrationOpensIn: string | null | undefined) {
      this.setState((state) =>
        countdownReducer(state, action, registrationOpensIn)
      );
    }

    setupEventCountdown = (
      event: Event,
      registration: EventRegistration | null | undefined
    ) => {
      const { activationTime } = event;
      const poolActivationTime = moment(activationTime);

      if ((!registration && !activationTime) || registrationIsClosed(event)) {
        this.dispatch('REGISTRATION_NOT_AVAILABLE');
        return;
      }

      if (registration || poolActivationTime.isBefore(moment())) {
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
        const timeUntilRegistrationOpens =
          getTimeUntil(finishTime).asMilliseconds();

        if (timeUntilRegistrationOpens <= 0) {
          clearInterval(this.countdownTimer);
        }

        const [, action] =
          TICK_ACTIONS.find(([time]) => timeUntilRegistrationOpens <= time) ||
          [];
        const registrationOpensIn = moment(
          timeUntilRegistrationOpens + 1000
        ).format('mm:ss');

        if (action) {
          this.dispatch(action, registrationOpensIn);
        }
      };

      poll();
      this.countdownTimer = setInterval(poll, COUNTDOWN_INTERVAL);
    }

    render() {
      return (
        <WrappedComponent
          {...(this.props as Record<string, any>)}
          {...(this.state as Record<string, any>)}
        />
      );
    }
  };
}

function getTimeDifference(first: Dateish, second: Dateish): number {
  return moment(first).diff(moment(second));
}

export function getTimeUntil(
  time: Dateish,
  currentTime: Dateish = moment()
): Duration {
  return moment.duration(getTimeDifference(time, currentTime), 'milliseconds');
}
export default withCountdown;
