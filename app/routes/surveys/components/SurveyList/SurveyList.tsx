import { isEmpty } from 'lodash';
import SurveyItem from './SurveyItem';
import type { DetailedSurvey } from 'app/store/models/Survey';

type Props = {
  surveys: DetailedSurvey[];
  fetching: boolean;
};

const SurveyList = ({ surveys, fetching }: Props) => {
  if (isEmpty(surveys) && !fetching) {
    return (
      <span className="secondaryFontColor">
        Ingen spørreundersøkelser funnet
      </span>
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
