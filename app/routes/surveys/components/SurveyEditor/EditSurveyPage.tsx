import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams, useNavigate } from 'react-router';
import { editSurvey, fetchTemplates } from 'app/actions/SurveyActions';
import {
  selectSurveyTemplates,
  useFetchedSurvey,
  useFetchedTemplate,
} from 'app/reducers/surveys';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { questionTypeString } from 'app/routes/surveys/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type {
  DetailedSurvey,
  FormSubmitSurvey,
  FormSurvey,
} from 'app/store/models/Survey';

const defaultEditSurveyQuery = {
  templateTitle: '',
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
  const { templateTitle } = query;
  const template = useFetchedTemplate('addSurvey', templateTitle);
  const fetching = useAppSelector((state) => state.surveys.fetching);
  usePreparedEffect(
    'fetchSurveyTemplates',
    () => dispatch(fetchTemplates()),
    [],
  );
  const templates = useAppSelector(selectSurveyTemplates) as DetailedSurvey[];

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
        templateTitle={query.templateTitle}
        setTemplateTitle={setQueryValue('templateTitle')}
        templates={templates}
      />
    </Page>
  );
};

export default EditSurveyPage;
