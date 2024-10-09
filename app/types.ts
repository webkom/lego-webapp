import type { ActionGrant } from './models';
import type { NormalizedPayloadEntities } from './store/models/entities';
import type { AnyAction, EntityId, ThunkAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { JwtPayload } from 'jwt-decode';
import type { Overwrite } from 'utility-types';

export type { Reducer } from '@reduxjs/toolkit';

/**
 * Utility type for creating a union of objects, where all properties of the
 * intersection are accessible with optional types.
 *
 * Example:
 * type A = { a: string; b: number };
 * type B = {            b: number; c: boolean };
 * type C = ExclusifyUnion<A | B>;
 *
 * C is equal to: { a?: string; b: number; c?: boolean }
 */
export type ExclusifyUnion<
  T,
  K extends PropertyKey = T extends unknown ? keyof T : never,
> = T extends unknown
  ? T & { [P in Exclude<K, keyof T>]?: undefined } extends infer O
    ? { [P in keyof O]: O[P] }
    : never
  : never;

/**
 * Utility type for forms. Converts a value of type T to the form:
 * { value: T, label: number | string }
 */
export type ValueLabel<T extends object, K extends keyof T> = Overwrite<
  T,
  {
    [P in K]: { value: T[K]; label: number | string };
  }
>;

export type AsyncActionType = {
  BEGIN: `${string}.BEGIN`;
  SUCCESS: `${string}.SUCCESS`;
  FAILURE: `${string}.FAILURE`;
};
export type AsyncActionTypeArray = [string, string, string];
export type EncodedToken = string;
export type DecodedToken = JwtPayload & {
  user_id: number;
  username: string;
  exp: number;
  email: string;
  orig_iat: number;
};
export type Token = DecodedToken & {
  encodedToken: EncodedToken;
};

export type Action = {
  type: string;
  payload: any;
};

export type NormalizedApiPayload<T = unknown> = {
  actionGrant?: ActionGrant;
  entities: NormalizedPayloadEntities<T extends Array<infer E> ? E : T>;
  next?: string;
  previous?: string;
  result: T extends Array<unknown> ? EntityId[] : EntityId;
};

export type GetState = () => RootState;
export type GetCookie = (arg0: string) => EncodedToken | null | undefined;

export type Thunk<ReturnType> = ThunkAction<
  ReturnType,
  RootState,
  {
    getCookie: GetCookie;
  },
  AnyAction
>;
