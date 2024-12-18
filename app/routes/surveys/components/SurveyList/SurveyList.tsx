import { isEmpty } from 'lodash';
import { FolderOpen } from 'lucide-react';
import EmptyState from 'app/components/EmptyState';
import SurveyItem from './SurveyItem';
import type { DetailedSurvey } from 'app/store/models/Survey';

type Props = {
  surveys: DetailedSurvey[];
  fetching: boolean;
  isTemplates?: boolean;
};

const SurveyList = ({ surveys, fetching, isTemplates }: Props) => {
  if (isEmpty(surveys) && !fetching) {
    return (
      <EmptyState
        iconNode={<FolderOpen />}
        body={`Ingen ${isTemplates ? 'maler' : 'spørreundersøkelser'} funnet`}
      />
    );
  }

  return (
    <div>
      {surveys.map((survey) => (
        <SurveyItem key={survey.id} survey={survey} />
      ))}
    </div>
  );
};

export default SurveyList;
