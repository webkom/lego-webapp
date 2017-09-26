// @flow

import type { Store as ReduxStore, Middleware as ReduxMiddleware } from 'redux';
import type { Reducers } from 'app/reducers';

export type AsyncActionType = {|
  BEGIN: string,
  SUCCESS: string,
  FAILURE: string
|};

export type AsyncActionTypeArray = [string, string, string];

export type EntityID = number;

export type ArticleEntity = {
  id: EntityID,
  title: string,
  content: string,
  tags: Array<string>,
  cover: string,
  description: string
};

export type GalleryPictureEntity = {
  description?: string,
  active: boolean,
  file: string,
  galleryId: number,
  taggees?: Array<Object>
};

export type GalleryEntity = {
  title: string,
  description?: string,
  location?: string,
  takenAt?: Date,
  photographers?: EntityID[],
  event?: EntityID
};

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;

export type Store = ReduxStore<State, Action, Dispatch<*>>;

export type GetState = () => State;

export type Middleware = ReduxMiddleware<State, AnyAction<*>, Dispatch<*>>;

export type Action = {|
  type: string,
  payload?: any,
  meta?: any,
  error?: boolean
|};

export type PromiseAction<T> = {|
  types: AsyncActionType,
  promise: Promise<T>,
  meta?: any,
  payload?: any
|};

export type AnyAction<R> = PromiseAction<R> | Thunk<R> | Action;

export type Dispatch<R> = (action: AnyAction<R>) => R;

export type Thunk<R> = (dispatch: Dispatch<R>, getState: GetState) => R;
