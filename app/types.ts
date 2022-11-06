import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store/rootReducer';
export type AsyncActionType = {
  BEGIN: string;
  SUCCESS: string;
  FAILURE: string;
};
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
export type GetCookie = (arg0: string) => EncodedToken | null | undefined;
export type Thunk<ReturnType> = ThunkAction<
  ReturnType,
  RootState,
  {
    getCookie: GetCookie;
  },
  AnyAction
>;
export type ReduxFormProps = {
  pristine: boolean;
  submitting: boolean;
  invalid: boolean;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
};

// TODO: Add proper type
export type SentryType = any;
