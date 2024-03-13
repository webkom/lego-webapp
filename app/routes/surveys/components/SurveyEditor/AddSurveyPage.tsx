import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import { fetchEvent } from 'app/actions/EventActions';
import { addSurvey } from 'app/actions/SurveyActions';
import { Content } from 'app/components/Content';
import { selectEventById } from 'app/reducers/events';
import { useFetchedTemplate } from 'app/reducers/surveys';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { initialQuestion } from 'app/routes/surveys/components/SurveyEditor/utils';
import { DetailNavigation } from 'app/routes/surveys/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type { Dateish } from 'app/models';
import type { AdministrateEvent, EventType } from 'app/store/models/Event';
import type { FormSubmitSurvey, FormSurvey } from 'app/store/models/Survey';

const defaultAddSurveyQuery = {
  templateType: '' as EventType,
  event: '',
};

const AddSurveyPage = () => {
  const dispatch = useAppDispatch();
  const fetching = useAppSelector(
    (state) => state.surveys.fetching || state.events.fetching
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
          setTemplateType(payload.entities.events[payload.result]!.eventType)
        );
      }
    },
    [event]
  );

  const fullEvent = useAppSelector((state) =>
    selectEventById(state, { eventId: event })
  ) as AdministrateEvent | Record<string, never>;

  const navigate = useNavigate();
  const onSubmit = (surveyData: FormSubmitSurvey): Promise<void> =>
    dispatch(addSurvey(surveyData)).then((res) =>
      navigate(`/surveys/${res.payload.result}`)
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
    <Content>
      <DetailNavigation title="Ny spørreundersøkelse" />
      <SurveyForm
        isNew
        onSubmit={onSubmit}
        initialValues={initialValues}
        templateType={templateType}
        setTemplateType={setTemplateType}
      />
    </Content>
  );
};

const getActiveFrom = (eventEndTime?: Dateish) =>
  moment(eventEndTime)
    .add({ days: 1 })
    .set({ hours: 14, minutes: 30 })
    .toISOString();

export default AddSurveyPage;
