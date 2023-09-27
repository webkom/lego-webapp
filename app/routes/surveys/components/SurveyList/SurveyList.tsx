import { isEmpty } from 'lodash';
import SurveyItem from './SurveyItem';
import type { SelectedSurvey } from 'app/reducers/surveys';

type Props = {
  surveys: SelectedSurvey[];
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
