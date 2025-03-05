import { useOutletContext } from 'react-router';
import { ContentSection, ContentMain } from '~/components/Content';
import { useAppSelector } from '~/redux/hooks';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { getCsvUrl, getPdfUrl } from '../../utils';
import AdminSideBar from '../AdminSideBar';
import type { SurveysRouteContext } from 'app/routes/surveys';
import type { ComponentType } from 'react';
import type { EventForSurvey } from '~/redux/models/Event';
import type { DetailedSurvey } from '~/redux/models/Survey';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';

type ChildProps = {
  survey: DetailedSurvey;
  event: EventForSurvey;
  submissions: SurveySubmission[];
  fetchingSubmissions: boolean;
};
export type SubmissionsPageChild = ComponentType<ChildProps>;

type Props = {
  children: SubmissionsPageChild;
};

const SubmissionsPage = ({ children: Children }: Props) => {
  const { survey, event, submissions, fetchingSubmissions } =
    useOutletContext<SurveysRouteContext>();
  const authToken = useAppSelector((state) => state.auth.token);

  if (survey.isTemplate) {
    return (
      <div>
        <h3>Dette er en mal!</h3>
      </div>
    );
  }
  return (
    <ContentSection>
      <ContentMain>
        <Children
          survey={survey!}
          event={event!}
          submissions={submissions}
          fetchingSubmissions={fetchingSubmissions}
        />
      </ContentMain>

      <AdminSideBar
        isTemplate={survey.isTemplate}
        surveyId={survey!.id}
        actionGrant={survey!.actionGrant}
        token={survey!.token}
        exportSurveyCSV={async () => {
          const blob = await fetch(getCsvUrl(survey!.id), {
            headers: { Authorization: `Bearer ${authToken}` },
          }).then((response) => response.blob());
          return {
            url: URL.createObjectURL(blob),
            filename: survey!.title.replace(/ /g, '_') + '.csv',
          };
        }}
        exportSurveyPDF={async () => {
          const blob = await fetch(getPdfUrl(survey!.id), {
            headers: { Authorization: `Bearer ${authToken}` },
          }).then((response) => response.blob());
          return {
            url: URL.createObjectURL(blob),
            filename: survey!.title.replace(/ /g, '_') + '.pdf',
          };
        }}
      />
    </ContentSection>
  );
};

export default guardLogin(SubmissionsPage);
