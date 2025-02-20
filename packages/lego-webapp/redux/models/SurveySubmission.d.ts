import type { EntityId } from '@reduxjs/toolkit';
import type {
  AdminSurveyAnswer,
  FormSurveyAnswer,
  SurveyAnswer,
} from '~/redux/models/SurveyAnswer';

export interface SurveySubmission {
  id: EntityId;
  isOwner: boolean;
  survey: EntityId;
  answers: (SurveyAnswer | AdminSurveyAnswer)[];
}

export type FormSurveySubmission = {
  id?: EntityId;
  user: EntityId;
  answers: FormSurveyAnswer[];
};
