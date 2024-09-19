import moment from 'moment-timezone';
import { useCallback, useEffect, useState } from 'react';
import { registrationIsClosed } from '../utils';
import type { Dateish } from 'app/models';
import type { PoolRegistrationWithUser } from 'app/reducers/events';
import type { DetailedEvent } from 'app/store/models/Event';
import type { Duration } from 'moment-timezone';

enum CountdownState {
  RegistrationAvailable,
  NinetySecondsLeft,
  TenMinutesLeft,
  RegistrationNotAvailable,
}

type OpenState = {
  formOpen: boolean;
  captchaOpen: boolean;
  buttonOpen: boolean;
};

const CountdownStateMap: Record<CountdownState, OpenState> = {
  [CountdownState.RegistrationAvailable]: {
    formOpen: true,
    captchaOpen: true,
    buttonOpen: true,
  },
  [CountdownState.NinetySecondsLeft]: {
    formOpen: true,
    captchaOpen: true,
    buttonOpen: false,
  },
  [CountdownState.TenMinutesLeft]: {
    formOpen: true,
    captchaOpen: false,
    buttonOpen: false,
  },
  [CountdownState.RegistrationNotAvailable]: {
    formOpen: false,
    captchaOpen: false,
    buttonOpen: false,
  },
};

enum PollingFrequency {
  HIGH = 1000,
  LOW = 10000,
  NONE,
}

const getPollingFrequency = (activationTime: Dateish) => {
  const minutesLeft = getTimeUntil(activationTime).asMinutes();

  if (minutesLeft > 10) {
    return PollingFrequency.LOW;
  } else if (minutesLeft > 0) {
    return PollingFrequency.HIGH;
  }
  return PollingFrequency.NONE;
};

const getCountdownState = (
  event: DetailedEvent,
  registration?: PoolRegistrationWithUser,
) => {
  if ((!registration && !event.activationTime) || registrationIsClosed(event)) {
    return CountdownState.RegistrationNotAvailable;
  }
  const activationTime = moment(event.activationTime);

  if (registration || !moment().isBefore(activationTime)) {
    return CountdownState.RegistrationAvailable;
  }
  const secondsUntilRegistrationOpens = getTimeUntil(
    event.activationTime,
  ).asSeconds();

  if (secondsUntilRegistrationOpens <= 90) {
    return CountdownState.NinetySecondsLeft;
  } else if (secondsUntilRegistrationOpens <= 60 * 10) {
    return CountdownState.TenMinutesLeft;
  }

  return CountdownState.RegistrationNotAvailable;
};

export const useRegistrationCountdown = (
  event: DetailedEvent,
  registration?: PoolRegistrationWithUser,
) => {
  const [countdownState, setCountdownCountdownState] = useState<CountdownState>(
    getCountdownState(event, registration),
  );
  const [pollingFrequency, setPollingFrequency] = useState<PollingFrequency>(
    getPollingFrequency(event.activationTime),
  );
  const [registrationOpensIn, setRegistrationOpensIn] = useState<Duration>(
    getTimeUntil(event.activationTime),
  );

  const updateState = useCallback(() => {
    setCountdownCountdownState(getCountdownState(event, registration));
    setPollingFrequency(getPollingFrequency(event.activationTime));
    setRegistrationOpensIn(getTimeUntil(event.activationTime));
  }, [event, registration]);

  useEffect(() => {
    updateState();
  }, [updateState]);

  useEffect(() => {
    if (pollingFrequency === PollingFrequency.NONE) return;
    const interval = setInterval(() => {
      updateState();
    }, pollingFrequency);

    return () => clearInterval(interval);
  }, [pollingFrequency, updateState]);

  return {
    ...CountdownStateMap[countdownState],
    registrationOpensIn:
      registrationOpensIn.asMilliseconds() > 0 ? registrationOpensIn : null,
  };
};

function getTimeDifference(first: Dateish, second: Dateish): number {
  return moment(first).diff(moment(second));
}

export function getTimeUntil(
  time: Dateish,
  currentTime: Dateish = moment(),
): Duration {
  return moment.duration(getTimeDifference(time, currentTime), 'milliseconds');
}
