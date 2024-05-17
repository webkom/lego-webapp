import { Flex, LoadingIndicator, Page, PageCover } from '@webkom/lego-bricks';
import { useParams } from 'react-router-dom';
import { ContentSection, ContentMain } from 'app/components/Content';
import { NavigationLink } from 'app/components/NavigationTab';
import { useFetchedSurveySubmissions } from 'app/reducers/surveySubmissions';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { DetailNavigation, getCsvUrl } from '../../utils';
import AdminSideBar from '../AdminSideBar';
import styles from '../surveys.css';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { ComponentType } from 'react';

type ChildProps = {
  survey: DetailedSurvey;
  submissions: SurveySubmission[];
};
export type SubmissionsPageChild = ComponentType<ChildProps>;

type Props = {
  children: SubmissionsPageChild;
};

type SubmissionsPageParams = {
  surveyId: string;
};

const SubmissionsPage = ({ children: Children }: Props) => {
  const { surveyId } =
    useParams<SubmissionsPageParams>() as SubmissionsPageParams;
  const { survey, event } = useFetchedSurvey('surveySubmissions', surveyId);
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
    <Page
      cover={
        <PageCover
          image={event?.cover}
          imagePlaceholder={event?.coverPlaceholder}
        />
      }
      title={survey.title}
      back={{ href: '/surveys' }}
    >
      <DetailNavigation surveyId={Number(survey.id)} />

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
    </Page>
  );
};

export default guardLogin(SubmissionsPage);
