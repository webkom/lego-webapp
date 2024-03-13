import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { useParams } from 'react-router-dom';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import { NavigationLink } from 'app/components/NavigationTab';
import { useFetchedSurveySubmissions } from 'app/reducers/surveySubmissions';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { DetailNavigation, getCsvUrl } from '../../utils';
import AdminSideBar from '../AdminSideBar';
import styles from '../surveys.css';
import type { SelectedSurvey } from 'app/reducers/surveys';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { ReactNode } from 'react';

type ChildrenProps = {
  survey: SelectedSurvey;
  submissions: SurveySubmission[];
};

type Props = {
  children: (props: ChildrenProps) => ReactNode;
};

const SubmissionsPage = ({ children: Children }: Props) => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const survey = useFetchedSurvey('surveySubmissions', surveyId);
  const submissions = useFetchedSurveySubmissions(
    'surveySubmissions',
    surveyId,
  );
  const fetching = useAppSelector(
    (state) => state.surveys.fetching || state.surveySubmissions.fetching,
  );
  const authToken = useAppSelector((state) => state.auth.token);

  if (!survey) {
    return <LoadingIndicator loading={fetching} />;
  }

  return (
    <Content banner={survey.event.cover}>
      <DetailNavigation title={survey.title} surveyId={Number(survey.id)} />

      <ContentSection>
        <ContentMain>
          <Flex gap="0.5rem" className={styles.submissionNav}>
            <NavigationLink to={`/surveys/${survey.id}/submissions/summary`}>
              Oppsummering
            </NavigationLink>
            <NavigationLink to={`/surveys/${survey.id}/submissions/individual`}>
              Individuell
            </NavigationLink>
          </Flex>

          <Children survey={survey} submissions={submissions} />
        </ContentMain>

        <AdminSideBar
          surveyId={survey.id}
          actionGrant={survey.actionGrant}
          token={survey.token}
          exportSurvey={async () => {
            const blob = await fetch(getCsvUrl(survey.id), {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }).then((response) => response.blob());
            return {
              url: URL.createObjectURL(blob),
              filename: survey.title.replace(/ /g, '_') + '.csv',
            };
          }}
        />
      </ContentSection>
    </Content>
  );
};

export default guardLogin(SubmissionsPage);
