import type { EntityId } from '@reduxjs/toolkit';
import type {
  AdminSurveyAnswer,
  FormSurveyAnswer,
  SurveyAnswer,
} from 'app/store/models/SurveyAnswer';

export interface SurveySubmission {
  id: EntityId;
  user: EntityId;
  survey: EntityId;
  answers: (SurveyAnswer | AdminSurveyAnswer)[];
}

export type FormSurveySubmission = {
  id?: EntityId;
  user: EntityId;
  answers: FormSurveyAnswer[];
};
