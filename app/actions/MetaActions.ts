import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export interface IsAllowedMap {
  events: boolean;
  articles: boolean;
  joblistings: boolean;
  galleries: boolean;
  companies: boolean;
  meetings: boolean;
  polls: boolean;
  quotes: boolean;
  interestGroups: boolean;
  bdb: boolean;
  announcements: boolean;
  penalties: boolean;
  surveys: boolean;
  groups: boolean;
  email: boolean;
  users: boolean;
}

export interface SiteMeta {
  name: string;
  slogan: string;
  contactEmail: string;
  documentationUrl: string;
  domain: string;
  owner: string;
}

export interface FetchMetaSuccessPayload {
  site: SiteMeta;
  isAllowed: IsAllowedMap;
}

export const fetchMeta = createLegoApiAction<
  FetchMetaSuccessPayload,
  unknown
>()('Meta.FETCH', () => ({
  useCache: false,
  endpoint: '/site-meta/',
  meta: {
    errorMessage: 'Noe gikk galt med innlastingen av sida',
  },
  propagateError: true,
}));
