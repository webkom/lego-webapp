import { useOutletContext } from 'react-router';
import { ContentSection, ContentMain } from 'app/components/Content';
import { useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { getCsvUrl, getPdfUrl } from '../../utils';
import AdminSideBar from '../AdminSideBar';
import type { SurveysRouteContext } from 'app/routes/surveys';
import type { EventForSurvey } from 'app/store/models/Event';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { ComponentType } from 'react';

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
