import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models';
import type { EventType } from 'app/store/models/Event';
import type {
  SurveyQuestion,
  CreateSurveyQuestion,
  FormSurveyQuestion,
} from 'app/store/models/SurveyQuestion';
import type { ValueLabel } from 'app/types';
import type { Overwrite } from 'utility-types';

interface Survey {
  id: ID;
  title: string;
  activeFrom: Dateish;
  event: ID;
  templateType: EventType | null;
  questions: SurveyQuestion[];
}

export type PublicSurvey = Pick<
  Survey,
  'id' | 'title' | 'event' | 'templateType'
>;

export type DetailedSurvey = Pick<
  Survey,
  'id' | 'title' | 'event' | 'templateType' | 'questions'
>;

export type UnknownSurvey = PublicSurvey | DetailedSurvey;

export type CreateSurvey = Pick<
  Survey,
  'title' | 'activeFrom' | 'event' | 'templateType'
> & { questions: CreateSurveyQuestion[] };

export type FormSurvey = Overwrite<
  ValueLabel<CreateSurvey, 'event'>,
  { questions: FormSurveyQuestion[] }
>;
