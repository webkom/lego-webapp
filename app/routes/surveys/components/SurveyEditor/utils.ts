import { usePreparedEffect } from '@webkom/react-prepare';
import { schema } from 'normalizr';
import qs from 'qs';
import { useRouteMatch } from 'react-router-dom';
import { useLocation } from 'react-router-dom-v5-compat';
import { DeepPartial } from 'utility-types';
import { fetchEvent } from 'app/actions/EventActions';
import { fetchSurvey, fetchTemplate } from 'app/actions/SurveyActions';
import { selectEventById } from 'app/reducers/events';
import { selectSurveyById, selectSurveyTemplate } from 'app/reducers/surveys';
import type { Params } from 'app/routes/surveys/components/SurveyEditor/SurveyEditor';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type {
  DetailedEvent,
  EventType,
  ListEvent,
} from 'app/store/models/Event';
import type {
  Survey,
  FormSurvey,
  DetailedSurvey,
} from 'app/store/models/Survey';
import Entity = schema.Entity;
import type {
  NormalizedEntityPayload,
  EntityType,
  CallAPIResult,
} from 'app/store/models/entities';
import Entities from 'app/store/models/entities';
import { initialQuestion } from 'app/routes/surveys/components/SurveyEditor/SurveyEditor';
import { defaultActiveFrom } from 'app/routes/surveys/utils';

const parseQs = (search: string) => {
  const { templateType, event } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  return {
    templateType:
      typeof templateType === 'string'
        ? (templateType as EventType)
        : undefined,
    event: typeof event === 'string' ? event : undefined,
  };
};

export const usePreparedFetchEditSurveyData = () => {
  const dispatch = useAppDispatch();
  const { params } = useRouteMatch<Params>();
  const location = useLocation();

  const { surveyId } = params;
  usePreparedEffect(
    'fetchSurveyEditorSurvey',
    () => {
      if (surveyId) {
        return dispatch(fetchSurvey(surveyId));
      }
    },
    [surveyId]
  );

  const { templateType, event } = parseQs(location.search);
  usePreparedEffect(
    'fetchSurveyEditorTemplate',
    () => {
      if (templateType) {
        return dispatch(fetchTemplate(templateType));
      }
    },
    [templateType]
  );
  usePreparedEffect(
    'fetchAddSurveyEvent',
    () => {
      if (event) {
        return dispatch(fetchEvent(event)).then(
          ({ payload }: CallAPIResult<EntityType.Events>) =>
            dispatch(fetchTemplate(payload.entities.events[event].eventType))
        );
      }
    },
    [event]
  );
};

export const useCurrentSurvey = (): Survey | undefined => {
  const { params } = useRouteMatch<Params>();
  const surveyId =
    params.surveyId === undefined ? undefined : Number(params.surveyId);
  return useAppSelector((state) =>
    surveyId === undefined ? undefined : selectSurveyById(state, { surveyId })
  );
};

export const useSurveyEvent = (
  survey: Survey | undefined
): ListEvent | undefined => {
  const location = useLocation();
  const { event: eventId } = parseQs(location.search);
  return useAppSelector((state) =>
    survey ? survey.event : eventId && selectEventById(state, { eventId })
  );
};

export const useSurveyTemplate = (isNew: boolean, event?: ListEvent) => {
  const location = useLocation();

  const eventTemplateType = isNew && event ? event.eventType : undefined;
  const qsTemplateType = parseQs(location.search).templateType;
  const templateType = qsTemplateType || eventTemplateType;

  const template = useAppSelector(
    (state) => templateType && selectSurveyTemplate(state, { templateType })
  );

  return { template, templateType };
};

export const useInitialValues = (
  fetching: boolean,
  isNew: boolean,
  event: ListEvent | undefined,
  template: DetailedSurvey | undefined
): Partial<FormSurvey> | undefined => {
  if (fetching) return;

  console.log(template);

  const title = event ? `Spørreundersøkelse for ${event.title}` : '';

  if (isNew) {
    const initialEvent = event
      ? {
          value: event.id,
          label: event.title,
        }
      : undefined;
    const activeFrom = event ? event.endTime : defaultActiveFrom(12, 0);

    if (template) {
      return {
        ...template,
        title,
        event: initialEvent,
        activeFrom,
      };
    } else {
      return {
        activeFrom,
        event: initialEvent,
        title,
        questions: [initialQuestion],
      };
    }
  }
};
