import { Store as ReduxStore, Middleware as ReduxMiddleware } from 'redux';
import { Reducers } from 'app/reducers';

export type AsyncActionType = {|
  BEGIN: string,
  SUCCESS: string,
  FAILURE: string
|};

export type AsyncActionTypeArray = [string, string, string];

export type EntityID = number;

export interface ArticleEntity {
  id: EntityID,
  title: string,
  author: number,
  content: string,
  tags: Array<string>,
  cover: string,
  description: string,
  pinned: boolean
};

export interface GalleryPictureEntity {
  description?: string,
  active: boolean,
  file: string,
  galleryId: number,
  taggees?: Array<Object>
};

export interface GalleryEntity {
  title: string,
  description?: string,
  id: number,
  location?: string,
  takenAt?: Date,
  photographers?: EntityID[],
  event?: EntityID
};

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;

export type EncodedToken = string;

export interface DecodedToken {
  user_id: number,
  username: string,
  exp: number,
  email: string,
  orig_iat: number
};

export interface Token extends DecodedToken {
  encodedToken: EncodedToken
};

// Todo: remove any
export type Reducer = any; // (state: State, action: Action) => State;

export type Store = ReduxStore<State, Action, Dispatch<*>>;

export type GetState = () => State;

export type GetCookie = string => ?EncodedToken;

export type Middleware = ReduxMiddleware<State, AnyAction<*>, Dispatch<*>>;

export interface Action = {|
  type: string,
  payload?: any,
  meta?: any,
  error?: boolean,
  success?: boolean // 65 WAT M8 https://github.com/acdlite/flux-standard-action
|};

export interface PromiseAction<T> {|
  types: AsyncActionType,
  promise: Promise<T>,
  meta?: any,
  payload?: any
|};

export type AnyAction<R> = PromiseAction<R> | Thunk<R> | Action;

export type Dispatch<R> = (action: AnyAction<R>) => R;

export type Thunk<R> = (
  dispatch: Dispatch<R>,
  getState: GetState,
  { getCookie: GetCookie }
) => R;

export interface ReduxFormProps {
  pristine: boolean,
  submitting: boolean,
  invalid: boolean,
  handleSubmit: Function => void
};
