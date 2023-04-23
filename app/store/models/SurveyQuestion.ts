import type { ID } from 'app/store/models/index';
import type { ValueLabel } from 'app/types';
import type { Overwrite } from 'utility-types';

export enum SurveyQuestionType {
  SingleChoice = 'single_choice',
  MultipleChoice = 'multiple_choice',
  TextField = 'text_field',
  PieChart = 'pie_chart',
  BarChart = 'bar_chart',
}
export enum SurveyQuestionDisplayType {
  PieChart = 'pie_chart',
  BarChart = 'bar_chart',
}

export interface SurveyQuestion {
  id: ID;
  displayType: SurveyQuestionDisplayType;
  questionType: SurveyQuestionType;
  questionText: string;
  mandatory: boolean;
  options: SurveyQuestionOption[];
  relativeIndex: number;
}

export interface SurveyQuestionOption {
  id: ID;
  optionText: string;
  relativeIndex: number;
}

export type CreateSurveyQuestion = Pick<
  SurveyQuestion,
  | 'displayType'
  | 'questionType'
  | 'questionText'
  | 'mandatory'
  | 'relativeIndex'
> & { options: Pick<SurveyQuestionOption, 'optionText' | 'relativeIndex'>[] };

export type FormSurveyQuestionOption = ValueLabel<
  SurveyQuestionOption,
  'relativeIndex'
>;

export type FormSurveyQuestion = Overwrite<
  CreateSurveyQuestion,
  { options: FormSurveyQuestionOption[] }
>;
