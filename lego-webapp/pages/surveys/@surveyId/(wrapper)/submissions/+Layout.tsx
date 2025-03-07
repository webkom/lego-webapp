import { PropsWithChildren, useContext } from 'react';
import { ContentSection, ContentMain } from '~/components/Content';
import { useAppSelector } from '~/redux/hooks';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import AdminSideBar from '../../../components/AdminSideBar';
import { getCsvUrl, getPdfUrl } from '../../../utils';
import { SurveysRouteContext } from '../SurveysRouteContext';

const SubmissionsPage = ({ children }: PropsWithChildren) => {
  const { survey } = useContext(SurveysRouteContext);

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
      <ContentMain>{children}</ContentMain>

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
