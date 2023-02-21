import type { SurveyAnswer } from 'app/store/models/SurveyAnswer';
import type { ID } from 'app/store/models/index';

interface SurveySubmission {
  id: ID;
  user: ID;
  survey: ID;
  answers: SurveyAnswer[];
}
