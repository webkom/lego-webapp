import callAPI from 'app/actions/callAPI';
import { Meta } from './ActionTypes';
import type { ResolvedPromiseAction } from 'app/store/middleware/promiseMiddleware';

export type AllowedPages = {
  announcements: boolean;
  articles: boolean;
  bdb: boolean;
  companies: boolean;
  email: boolean;
  events: boolean;
  forums: boolean;
  galleries: boolean;
  groups: boolean;
  interestGroups: boolean;
  joblistings: boolean;
  meetings: boolean;
  penalties: boolean;
  polls: boolean;
  quotes: boolean;
  surveys: boolean;
  users: boolean;
};

type MetaPayload = {
  site: {
    name: string;
    slogan: string;
    contactEmail: string;
    documentationUrl: string;
    domain: string;
    owner: string;
  };
  isAllowed: AllowedPages;
};

export type FetchMetaSuccessAction = ResolvedPromiseAction<MetaPayload>;

export function fetchMeta() {
  return callAPI<MetaPayload>({
    types: Meta.FETCH,
    endpoint: '/site-meta/',
    meta: {
      errorMessage: 'Noe gikk galt med innlastingen av sida',
    },
    propagateError: true,
  });
}
