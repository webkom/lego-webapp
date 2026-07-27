import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { fetchEvent, register, unregister } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventStatusType } from '~/redux/models/Event';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectRegistrationForEventByUserId } from '~/redux/slices/events';
import type { EntityId } from '@reduxjs/toolkit';
import type { ListEvent } from '~/redux/models/Event';

const useJoinEvent = (event: ListEvent) => {
  const [pending, setPending] = useState(false);

  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const registrationProps = useMemo(
    () => ({ eventId: event.id, userId: currentUser?.id }),
    [event.id, currentUser?.id],
  );
  const storedRegistration = useAppSelector((state) =>
    selectRegistrationForEventByUserId(state, registrationProps),
  );
  const registration = storedRegistration ?? event.userReg;

  const lacksPoolAccess = !registration && event.activationTime == null;

  const joinable =
    !!currentUser &&
    !lacksPoolAccess &&
    (event.eventStatusType === EventStatusType.NORMAL ||
      event.eventStatusType === EventStatusType.INFINITE) &&
    moment().isBefore(event.startTime);

  const isFull =
    !!event.totalCapacity &&
    (event.registrationCount ?? 0) >= event.totalCapacity;

  const isProcessing =
    pending ||
    registration?.status === 'PENDING_REGISTER' ||
    registration?.status === 'PENDING_UNREGISTER';

  const isAdmitted = registration ? !!registration.pool : event.isAdmitted;
  const isWaitlisted =
    !!registration &&
    registration.status === 'SUCCESS_REGISTER' &&
    !registration.pool;
  const joined = isAdmitted || isWaitlisted;

  // The backend admits interest events synchronously, so the response
  // carries the final outcome and flips the button on arrival; the refetch
  // refreshes the attendance counts and resolves the rare async fallback.
  // Interest events skip captcha (use_captcha is forced off by the backend).
  const join = async () => {
    if (!currentUser || isProcessing) return;

    setPending(true);
    try {
      await dispatch(
        register({
          eventId: event.id,
          captchaResponse: '',
          feedback: '',
          userId: currentUser.id,
        }),
      );
      dispatch(fetchEvent(event.id));
    } finally {
      setPending(false);
    }
  };

  const leave = async () => {
    if (!currentUser || isProcessing) return;

    setPending(true);
    try {
      let registrationId: EntityId | undefined =
        registration && registration.status !== 'SUCCESS_UNREGISTER'
          ? registration.id
          : undefined;

      if (!registrationId) {
        await dispatch(fetchEvent(event.id));
        const refreshed = dispatch((_dispatch, getState) =>
          selectRegistrationForEventByUserId(getState(), registrationProps),
        );
        if (refreshed && refreshed.status !== 'SUCCESS_UNREGISTER') {
          registrationId = refreshed.id;
        }
      }

      if (registrationId) {
        await dispatch(unregister({ eventId: event.id, registrationId }));
        dispatch(fetchEvent(event.id));
      }
    } finally {
      setPending(false);
    }
  };

  return {
    joinable,
    joined,
    isFull,
    label: isAdmitted
      ? 'Med'
      : isWaitlisted
        ? 'I kø'
        : isFull
          ? 'Venteliste'
          : 'Bli med',
    title: isAdmitted
      ? 'Trykk for å melde deg av'
      : isWaitlisted
        ? 'Trykk for å forlate ventelisten'
        : undefined,
    onPress: joined ? leave : join,
  };
};

export default useJoinEvent;
