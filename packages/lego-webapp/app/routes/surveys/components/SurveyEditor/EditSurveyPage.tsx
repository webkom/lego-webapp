import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { useParams, useNavigate } from 'react-router';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { questionTypeString } from 'app/routes/surveys/utils';
import useQuery from 'app/utils/useQuery';
import { editSurvey } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useFetchedSurvey, useFetchedTemplate } from '~/redux/slices/surveys';
import type { EventType } from '~/redux/models/Event';
import type { FormSubmitSurvey, FormSurvey } from '~/redux/models/Survey';

const defaultEditSurveyQuery = {
  templateType: '' as EventType,
};
type EditSurveyPageParams = {
  surveyId: string;
};
const EditSurveyPage = () => {
  const dispatch = useAppDispatch();
  const { surveyId } =
    useParams<EditSurveyPageParams>() as EditSurveyPageParams;
  const { query, setQueryValue } = useQuery(defaultEditSurveyQuery);
  const { survey, event } = useFetchedSurvey('editSurvey', surveyId);
  const { templateType } = query;
  const template = useFetchedTemplate('addSurvey', templateType);
  const fetching = useAppSelector((state) => state.surveys.fetching);

  const navigate = useNavigate();
  const onSubmit = (surveyData: FormSubmitSurvey): Promise<void> =>
    dispatch(editSurvey({ surveyId, ...surveyData })).then(() =>
      navigate('..', { relative: 'path' }),
    );

  if (!survey) {
    return <LoadingIndicator loading />;
  }

  const initialValues: Partial<FormSurvey> = {
    ...survey,
    event: { value: event?.id ?? 0, label: event?.title ?? '' },
    questions: (template ?? survey).questions.map((question) => ({
      ...question,
      questionType: {
        value: question.questionType,
        label: questionTypeString[question.questionType],
      },
      options: [...question.options, { optionText: '' }],
    })),
  };

  return (
    <Page
      title={`Redigerer: ${survey.title}`}
      skeleton={fetching}
      back={{ href: `/surveys/${surveyId}` }}
    >
      <SurveyForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        templateType={query.templateType}
        setTemplateType={setQueryValue('templateType')}
      />
    </Page>
  );
};

export default EditSurveyPage;
