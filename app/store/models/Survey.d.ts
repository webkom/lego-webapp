import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { EventType } from 'app/store/models/Event';
import type {
  SurveyQuestion,
  FormSurveyQuestion,
  FormSubmitSurveyQuestion,
  SurveyQuestionType,
} from 'app/store/models/SurveyQuestion';
import type { ValueLabel } from 'app/types';
import type { Optional, Overwrite } from 'utility-types';

interface Survey {
  id: EntityId;
  title: string;
  activeFrom: Dateish;
  event: EntityId;
  templateType: EventType | null;
  questions: SurveyQuestion[];
  actionGrant: ActionGrant;
  token: string | null;
}

export type PublicSurvey = Pick<
  Survey,
  'id' | 'title' | 'event' | 'templateType'
>;

export type DetailedSurvey = Pick<
  Survey,
  | 'id'
  | 'title'
  | 'activeFrom'
  | 'event'
  | 'templateType'
  | 'questions'
  | 'actionGrant'
  | 'token'
>;

interface PublicChoiceQuestionResult {
  questionType:
    | SurveyQuestionType.MultipleChoice
    | SurveyQuestionType.SingleChoice;
  [key: number]: number;
}
interface PublicTextQuestionResult {
  questionType: SurveyQuestionType.TextField;
  answers: string[];
}
export type PublicResultsSurvey = Omit<
  DetailedSurvey,
  'actionGrant' | 'token'
> & {
  results: {
    [key: EntityId]: PublicTextQuestionResult | PublicChoiceQuestionResult;
  };
  submissionCount: number;
};

export type UnknownSurvey = PublicSurvey | DetailedSurvey;

export type FormSubmitSurvey = Overwrite<
  Optional<Survey, 'id'>,
  { questions: FormSubmitSurveyQuestion[] }
>;
export type FormSurvey = Overwrite<
  ValueLabel<Optional<Survey, 'id'>, 'event'>,
  { questions: FormSurveyQuestion[] }
>;
