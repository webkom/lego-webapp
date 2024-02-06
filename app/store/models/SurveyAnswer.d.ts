import type { ID } from 'app/store/models';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { Overwrite } from 'utility-types';

interface CompleteSurveyAnswer {
  id: ID;
  submission: ID;
  question: SurveyQuestion;
  answerText: string;
  selectedOptions: ID[];
  hideFromPublic: boolean;
}

export type SurveyAnswer = Pick<
  CompleteSurveyAnswer,
  'id' | 'submission' | 'question' | 'answerText' | 'selectedOptions'
>;

export type AdminSurveyAnswer = Pick<CompleteSurveyAnswer, 'hideFromPublic'> &
  CompleteSurveyAnswer;

export type FormSurveyAnswer = Overwrite<
  Pick<CompleteSurveyAnswer, 'question' | 'answerText' | 'selectedOptions'>,
  {
    question: ID;
  }
>;
