import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { navigate } from 'vike/client/router';
import SurveyForm from '~/pages/(migrated)/surveys/components/SurveyEditor/SurveyForm';
import { questionTypeString } from '~/pages/(migrated)/surveys/utils';
import { editSurvey, fetchTemplates } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectSurveyTemplates,
  useFetchedSurvey,
  useFetchedTemplate,
} from '~/redux/slices/surveys';
import { useParams } from '~/utils/useParams';
import useQuery from '~/utils/useQuery';
import type {
  DetailedSurvey,
  FormSubmitSurvey,
  FormSurvey,
} from '~/redux/models/Survey';

const defaultEditSurveyQuery = {
  templateId: '',
};
type EditSurveyPageParams = {
  surveyId: string;
};
const EditSurveyPage = () => {
  const dispatch = useAppDispatch();
  const { surveyId } = useParams<EditSurveyPageParams>();
  const { query, setQueryValue } = useQuery(defaultEditSurveyQuery);
  const { survey, event } = useFetchedSurvey('editSurvey', surveyId);
  const { templateId } = query;
  const template = useFetchedTemplate('addSurvey', templateId);
  const fetching = useAppSelector((state) => state.surveys.fetching);
  usePreparedEffect(
    'fetchSurveyTemplates',
    () => dispatch(fetchTemplates()),
    [],
  );
  const templates = useAppSelector(selectSurveyTemplates) as DetailedSurvey[];

  const onSubmit = (surveyData: FormSubmitSurvey): Promise<void> =>
    dispatch(editSurvey({ surveyId, ...surveyData })).then(() =>
      navigate('..', { relative: 'path' }),
    );

  if (!survey) {
    return <LoadingIndicator loading />;
  }

  const initialValues: Partial<FormSurvey> = {
    ...survey,
    event: survey?.isTemplate
      ? { value: null, label: '' }
      : { value: event?.id ?? 0, label: event?.title ?? '' },
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
        templateId={query.templateId}
        setTemplateId={setQueryValue('templateId')}
        templates={templates}
      />
    </Page>
  );
};

export default EditSurveyPage;
