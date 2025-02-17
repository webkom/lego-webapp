import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router';
import { fetchEvent } from 'app/actions/EventActions';
import { addSurvey, fetchTemplates } from 'app/actions/SurveyActions';
import { selectEventById } from 'app/reducers/events';
import {
  selectSurveyTemplates,
  useFetchedTemplate,
} from 'app/reducers/surveys';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { initialQuestion } from 'app/routes/surveys/components/SurveyEditor/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type { Dateish } from 'app/models';
import type { AdministrateEvent } from 'app/store/models/Event';
import type {
  DetailedSurvey,
  FormSubmitSurvey,
  FormSurvey,
} from 'app/store/models/Survey';

const defaultAddSurveyQuery = {
  templateId: '',
  event: '',
};

const AddSurveyPage = () => {
  const dispatch = useAppDispatch();
  const fetching = useAppSelector(
    (state) => state.surveys.fetching || state.events.fetching,
  );
  const { query, setQueryValue } = useQuery(defaultAddSurveyQuery);
  const setTemplateId = setQueryValue('templateId');
  const { templateId, event } = query;
  const template = useFetchedTemplate('addSurvey', templateId);
  usePreparedEffect(
    'fetchSurveyTemplates',
    () => dispatch(fetchTemplates()),
    [],
  );
  const templates = useAppSelector(selectSurveyTemplates) as DetailedSurvey[];

  usePreparedEffect(
    'fetchAddSurveyEvent',
    () => {
      if (event) {
        return dispatch(fetchEvent(event)).then(({ payload }) =>
          setTemplateId(payload.entities.events[payload.result]!.id.toString()),
        );
      }
    },
    [event],
  );

  const fullEvent = useAppSelector((state) =>
    selectEventById<AdministrateEvent>(state, event),
  );

  const navigate = useNavigate();
  const onSubmit = (surveyData: FormSubmitSurvey): Promise<void> =>
    dispatch(addSurvey(surveyData)).then((res) =>
      navigate(`/surveys/${res.payload.result}`),
    );

  const fetchingTemplate = !isEmpty(fullEvent) && !template; // If we have an event but no corresponding template yet, it must still be fetching
  if (fetching || fetchingTemplate) {
    return <LoadingIndicator loading />;
  }

  const eventOption: FormSurvey['event'] | undefined = fullEvent
    ? {
        value: fullEvent.id,
        label: fullEvent.title,
      }
    : undefined;

  const initialValues: Partial<FormSurvey> = template
    ? {
        ...template,
        title: fullEvent ? `Spørreundersøkelse for ${fullEvent.title}` : '',
        event: eventOption,
        questions: template.questions.map((question) => ({
          ...question,
          questionType: {
            value: question.questionType,
            label: question.questionType,
          },
          options: [...question.options, { optionText: '' }],
        })),
        activeFrom: getActiveFrom(fullEvent?.endTime),
        isTemplate: false,
      }
    : {
        questions: [initialQuestion],
        activeFrom: getActiveFrom(),
      };

  return (
    <Page
      title="Ny spørreundersøkelse"
      back={{ label: 'Alle spørreundersøkelser', href: '/surveys' }}
    >
      <SurveyForm
        isNew
        onSubmit={onSubmit}
        initialValues={initialValues}
        templateId={templateId}
        setTemplateId={setTemplateId}
        templates={templates}
      />
    </Page>
  );
};

const getActiveFrom = (eventEndTime?: Dateish) =>
  moment(eventEndTime)
    .add({ days: 1 })
    .set({ hours: 14, minutes: 30 })
    .toISOString();

export default AddSurveyPage;
