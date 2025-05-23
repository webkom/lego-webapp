import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { ValueLabel } from 'app/types';
import type { Optional, Overwrite } from 'utility-types';
import type { EventType } from '~/redux/models/Event';
import type {
  SurveyQuestion,
  FormSurveyQuestion,
  FormSubmitSurveyQuestion,
  SurveyQuestionType,
} from '~/redux/models/SurveyQuestion';

interface Survey {
  id: EntityId;
  title: string;
  activeFrom: Dateish;
  event: EntityId | null;
  templateType: EventType | null;
  questions: SurveyQuestion[];
  actionGrant: ActionGrant;
  token: string | null;
  isTemplate: boolean;
}

export type PublicSurvey = Pick<
  Survey,
  'id' | 'title' | 'event' | 'templateType' | 'isTemplate'
>;

// Used on admin-pages
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
  | 'isTemplate'
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
// Used on the public (shared) results page
export type PublicResultsSurvey = Omit<
  DetailedSurvey,
  'actionGrant' | 'token'
> & {
  results: {
    [key: EntityId]: PublicTextQuestionResult | PublicChoiceQuestionResult;
  };
  submissionCount: number;
};

export type UnknownSurvey = PublicSurvey | PublicResultsSurvey | DetailedSurvey;

export type FormSubmitSurvey = Overwrite<
  Optional<Survey, 'id'>,
  { questions: FormSubmitSurveyQuestion[] }
>;
export type FormSurvey = Overwrite<
  ValueLabel<Optional<Survey, 'id'>, 'event'>,
  { questions: FormSurveyQuestion[] }
>;
