import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { initialQuestion } from 'app/routes/surveys/components/SurveyEditor/utils';
import useQuery from 'app/utils/useQuery';
import { fetchEvent } from '~/redux/actions/EventActions';
import { addSurvey } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectEventById } from '~/redux/slices/events';
import { useFetchedTemplate } from '~/redux/slices/surveys';
import type { Dateish } from 'app/models';
import type { AdministrateEvent, EventType } from '~/redux/models/Event';
import type { FormSubmitSurvey, FormSurvey } from '~/redux/models/Survey';

const defaultAddSurveyQuery = {
  templateType: '' as EventType,
  event: '',
};

const AddSurveyPage = () => {
  const dispatch = useAppDispatch();
  const fetching = useAppSelector(
    (state) => state.surveys.fetching || state.events.fetching,
  );
  const { query, setQueryValue } = useQuery(defaultAddSurveyQuery);
  const setTemplateType = setQueryValue('templateType');
  const { templateType, event } = query;
  const template = useFetchedTemplate('addSurvey', templateType);

  usePreparedEffect(
    'fetchAddSurveyEvent',
    () => {
      if (event) {
        return dispatch(fetchEvent(event)).then(({ payload }) =>
          setTemplateType(payload.entities.events[payload.result]!.eventType),
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
        templateType: null,
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
        templateType={templateType}
        setTemplateType={setTemplateType}
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
