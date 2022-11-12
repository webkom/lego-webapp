import type { Reducers } from 'app/reducers';
import type { Store as ReduxStore, Middleware as ReduxMiddleware } from 'redux';
import type {
  StartSubmitAction,
  StopSubmitAction,
  InitializeAction,
} from 'redux-form';

export type AsyncActionType = {
  BEGIN: string;
  SUCCESS: string;
  FAILURE: string;
};
export type AsyncActionTypeArray = [string, string, string];
export type EntityID = number;
export type ArticleEntity = {
  id: EntityID;
  title: string;
  author: number;
  content: string;
  tags: Array<string>;
  cover: string;
  description: string;
  pinned: boolean;
};
export type GalleryPictureEntity = {
  description?: string;
  active: boolean;
  file: string;
  galleryId: number;
  taggees?: Array<Record<string, any>>;
};
export type GalleryEntity = {
  title: string;
  description?: string;
  id: number;
  location?: string;
  takenAt?: Date;
  photographers?: EntityID[];
  event?: EntityID;
};
type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;
export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;
export type EncodedToken = string;
export type DecodedToken = {
  user_id: number;
  username: string;
  exp: number;
  email: string;
  orig_iat: number;
};
export type Token = DecodedToken & {
  encodedToken: EncodedToken;
};
// Todo: remove any
export type Reducer = any; // (state: State, action: Action) => State;

export type Action = {
  type: string;
  payload?: any;
  meta?: any;
  error?: boolean;
  success?: boolean; // 65 WAT M8 https://github.com/acdlite/flux-standard-action
};
export type PromiseAction<T> = {
  types: AsyncActionType;
  promise: Promise<T>;
  meta?: any;
  payload?: any;
};
export type GetState = () => State;
export type GetCookie = (arg0: string) => EncodedToken | null | undefined;
export type Thunk<R> = (
  // eslint-disable-next-line no-use-before-define
  dispatch: Dispatch<R>,
  getState: GetState,
  arg2: {
    getCookie: GetCookie;
  }
) => R;
export type AnyAction<R> =
  | PromiseAction<R>
  | Thunk<R>
  | Action
  | StopSubmitAction
  | StartSubmitAction
  | InitializeAction;
export type Dispatch<R> = (action: AnyAction<R>) => R;
export type Store = ReduxStore<State, Action, Dispatch<any>>;
export type Middleware = ReduxMiddleware<State, AnyAction<any>, Dispatch<any>>;
export type ReduxFormProps = {
  pristine: boolean;
  submitting: boolean;
  invalid: boolean;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
};
