import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models';
import type Event from 'app/store/models/Event';
import type User from 'app/store/models/User';
import type { Action } from '@reduxjs/toolkit';

export const SOCKET_INITIATE_PAYMENT_SUCCESS =
  'Event.SOCKET_INITIATE_PAYMENT.SUCCESS';
export const SOCKET_INITIATE_PAYMENT_FAILURE =
  'Event.SOCKET_INITIATE_PAYMENT.FAILURE';

export const SOCKET_PAYMENT_SUCCESS = 'Event.SOCKET_PAYMENT.SUCCESS';
export const SOCKET_PAYMENT_FAILURE = 'Event.SOCKET_PAYMENT.FAILURE';

export const SOCKET_REGISTRATION_SUCCESS = 'Event.SOCKET_REGISTRATION.SUCCESS';
export const SOCKET_REGISTRATION_FAILURE = 'Event.SOCKET_REGISTRATION.FAILURE';

export const SOCKET_UNREGISTRATION_SUCCESS =
  'Event.SOCKET_UNREGISTRATION.SUCCESS';
export const SOCKET_UNREGISTRATION_FAILURE =
  'Event.SOCKET_UNREGISTRATION.FAILURE';

export const SOCKET_EVENT_UPDATED = 'SOCKET_EVENT_UPDATED';

const createWSAction = <T extends Action>(type: T['type']) =>
  Object.assign(
    (action: Omit<T, 'type'>) => ({
      type,
      ...action,
    }),
    {
      type,
      match: (action: Action<unknown>): action is T => action.type === type,
    }
  );

type WSAction<
  Type extends string,
  Payload,
  ExtraMeta extends Record<string, unknown> = Record<string, unknown>
> = {
  type: Type;
  payload: Payload;
  meta: {
    currentUser: User | null;
  } & ExtraMeta;
};

export type SocketRegistrationSuccessAction = WSAction<
  typeof SOCKET_REGISTRATION_SUCCESS,
  {
    id: ID;
    pool: ID;
    status: string; // TODO: enum
    user: User;
  },
  {
    eventId: ID;
  }
>;
export const socketRegistrationSuccess =
  createWSAction<SocketRegistrationSuccessAction>(SOCKET_REGISTRATION_SUCCESS);

export type SocketRegistrationFailureAction = WSAction<
  typeof SOCKET_REGISTRATION_FAILURE,
  unknown,
  {
    eventId: ID;
  }
>;
export const socketRegistrationFailure =
  createWSAction<SocketRegistrationFailureAction>(SOCKET_REGISTRATION_FAILURE);

export type SocketUnregistrationSuccessAction = WSAction<
  typeof SOCKET_UNREGISTRATION_SUCCESS,
  {
    id: ID;
    pool: ID | null;
    status: string; // TODO: enum
    user: User;
  },
  {
    activationTime: Dateish;
    fromPool: ID;
    eventId: ID;
  }
>;
export const socketUnregistrationSuccess =
  createWSAction<SocketUnregistrationSuccessAction>(
    SOCKET_UNREGISTRATION_SUCCESS
  );

export type SocketEventUpdatedAction = WSAction<
  typeof SOCKET_EVENT_UPDATED,
  Event
>;
export const socketEventUpdated =
  createWSAction<SocketEventUpdatedAction>(SOCKET_EVENT_UPDATED);
