import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { initialQuestion } from 'app/routes/surveys/components/SurveyEditor/utils';
import { fetchEvent } from '~/redux/actions/EventActions';
import { addSurvey, fetchTemplates } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectEventById } from '~/redux/slices/events';
import {
  selectSurveyTemplates,
  useFetchedTemplate,
} from '~/redux/slices/surveys';
import useQuery from '~/utils/useQuery';
import type { Dateish } from 'app/models';
import type { AdministrateEvent } from '~/redux/models/Event';
import type {
  DetailedSurvey,
  FormSubmitSurvey,
  FormSurvey,
} from '~/redux/models/Survey';

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
        return dispatch(fetchEvent(event));
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

  if (fetching || (!fullEvent && event)) {
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
        title: fullEvent ? `Spørreundersøkelse for ${fullEvent.title}` : '',
        event: eventOption,
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
