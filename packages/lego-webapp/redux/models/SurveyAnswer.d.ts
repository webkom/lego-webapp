import type { EntityId } from '@reduxjs/toolkit';
import type { Overwrite } from 'utility-types';
import type { SurveyQuestion } from '~/redux/models/SurveyQuestion';

interface CompleteSurveyAnswer {
  id: EntityId;
  submission: EntityId;
  question: SurveyQuestion;
  answerText: string;
  selectedOptions: EntityId[];
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
    question: EntityId;
  }
>;
