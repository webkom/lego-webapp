import type { ID } from 'app/store/models';
import type {
  AdminSurveyAnswer,
  FormSurveyAnswer,
  SurveyAnswer,
} from 'app/store/models/SurveyAnswer';

export interface SurveySubmission {
  id: ID;
  user: ID;
  survey: ID;
  answers: (SurveyAnswer | AdminSurveyAnswer)[];
}

export type FormSurveySubmission = {
  id?: ID;
  user: ID;
  answers: FormSurveyAnswer[];
};
