import { createContext } from 'react';
import type { EventForSurvey } from '~/redux/models/Event';
import type { DetailedSurvey } from '~/redux/models/Survey';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';

type SurveysRouteContextType = {
  survey: DetailedSurvey;
  event?: EventForSurvey;
  submissions: SurveySubmission[];
  fetchingSubmissions: boolean;
};

export const SurveysRouteContext = createContext<SurveysRouteContextType>(
  {} as SurveysRouteContextType,
);
