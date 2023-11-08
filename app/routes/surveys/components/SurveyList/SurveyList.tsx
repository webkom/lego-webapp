import { LoadingIndicator } from '@webkom/lego-bricks';
import styles from '../surveys.css';
import SurveyItem from './SurveyItem';
import type { SurveyEntity } from 'app/reducers/surveys';

type Props = {
  surveys: Array<SurveyEntity>;
  fetching: boolean;
};

const SurveyList = (props: Props) => {
  const { surveys, fetching } = props;
  const surveys_to_render = surveys.map((survey) => (
    <SurveyItem key={survey.id} survey={survey} />
  ));

  if (fetching && !surveys) {
    return <LoadingIndicator loading />;
  }

  if (surveys_to_render.length === 0) {
    return (
      <span className="secondaryFontColor">
        Ingen spørreundersøkelser funnet
      </span>
    );
  }

  return <div className={styles.surveyList}>{surveys_to_render}</div>;
};

export default SurveyList;
