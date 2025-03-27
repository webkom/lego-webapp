import { EntityId } from '@reduxjs/toolkit';
import {
  Article as ArticleAT,
  AsyncActionType,
  Event as EventAT,
} from '../actionTypes';
import callAPI from './callAPI';

export type Analytics = {
  bounceRate: number | null;
  date: string;
  pageviews: number | null;
  visitDuration: number | null;
  visitors: number | null;
};

type ValidAnalyticsAT = {
  FETCH_ANALYTICS: AsyncActionType;
};

// Ensure entities need to have matching action types containing FETCH_ANALYTICS
const entityActionType = {
  event: EventAT as ValidAnalyticsAT,
  article: ArticleAT as ValidAnalyticsAT,
} as const;

export type AnalyticsEntity = keyof typeof entityActionType;

export function fetchAnalytics({
  entity,
  id,
}: {
  entity: AnalyticsEntity;
  id: EntityId;
}) {
  return callAPI<{
    results: Analytics[];
  }>({
    types: entityActionType[entity].FETCH_ANALYTICS,
    endpoint: `/${entity}s/${String(id)}/statistics/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av analyse feilet',
    },
  });
}
