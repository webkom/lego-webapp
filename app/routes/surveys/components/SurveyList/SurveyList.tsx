import { isEmpty } from 'lodash';
import EmptyState from 'app/components/EmptyState';
import SurveyItem from './SurveyItem';
import type { DetailedSurvey } from 'app/store/models/Survey';

type Props = {
  surveys: DetailedSurvey[];
  fetching: boolean;
};

const SurveyList = ({ surveys, fetching }: Props) => {
  if (isEmpty(surveys) && !fetching) {
    return (
      <EmptyState icon="folder-open-outline">
        Ingen spørreundersøkelser funnet
      </EmptyState>
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
