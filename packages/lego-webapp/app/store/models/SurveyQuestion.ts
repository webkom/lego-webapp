import type { EntityId } from '@reduxjs/toolkit';
import type { ValueLabel } from 'app/types';
import type { Optional, Overwrite } from 'utility-types';

export enum SurveyQuestionType {
  SingleChoice = 'single_choice',
  MultipleChoice = 'multiple_choice',
  TextField = 'text_field',
}
export enum SurveyQuestionDisplayType {
  PieChart = 'pie_chart',
  BarChart = 'bar_chart',
}

export interface SurveyQuestion {
  id: EntityId;
  displayType: SurveyQuestionDisplayType;
  questionType: SurveyQuestionType;
  questionText: string;
  mandatory: boolean;
  options: SurveyQuestionOption[];
  relativeIndex: number;
}

export interface SurveyQuestionOption {
  id: EntityId;
  optionText: string;
}

export type FormSubmitSurveyQuestion = Overwrite<
  Optional<SurveyQuestion, 'id'>,
  { options: Optional<SurveyQuestionOption, 'id'>[] }
>;
export type FormSurveyQuestion = ValueLabel<
  FormSubmitSurveyQuestion,
  'questionType'
>;
