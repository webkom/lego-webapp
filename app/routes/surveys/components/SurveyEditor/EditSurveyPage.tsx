import { LoadingIndicator } from '@webkom/lego-bricks';
import { useParams, useNavigate } from 'react-router-dom';
import { editSurvey } from 'app/actions/SurveyActions';
import { Content } from 'app/components/Content';
import { useFetchedSurvey, useFetchedTemplate } from 'app/reducers/surveys';
import SurveyForm from 'app/routes/surveys/components/SurveyEditor/SurveyForm';
import { DetailNavigation, questionTypeString } from 'app/routes/surveys/utils';
import { useAppDispatch } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type { EventType } from 'app/store/models/Event';
import type { FormSubmitSurvey, FormSurvey } from 'app/store/models/Survey';

const defaultEditSurveyQuery = {
  templateType: '' as EventType,
};

const EditSurveyPage = () => {
  const dispatch = useAppDispatch();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { query, setQueryValue } = useQuery(defaultEditSurveyQuery);
  const survey = useFetchedSurvey('editSurvey', surveyId);
  const { templateType } = query;
  const template = useFetchedTemplate('addSurvey', templateType);

  const navigate = useNavigate();
  const onSubmit = (surveyData: FormSubmitSurvey): Promise<void> =>
    dispatch(editSurvey({ surveyId, ...surveyData })).then(() =>
      navigate('..', { relative: 'path' })
    );

  if (!survey) {
    return <LoadingIndicator loading />;
  }

  const initialValues: Partial<FormSurvey> = {
    ...survey,
    event: { value: survey.event?.id ?? 0, label: survey.event?.title ?? '' },
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
    <Content>
      <DetailNavigation
        title={`Redigerer: ${survey.title}`}
        surveyId={surveyId}
      />
      <SurveyForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        templateType={query.templateType}
        setTemplateType={setQueryValue('templateType')}
      />
    </Content>
  );
};

export default EditSurveyPage;
