import LoadingIndicator from 'app/components/LoadingIndicator';
import type { SurveyEntity } from 'app/reducers/surveys';
import styles from '../surveys.css';
import SurveyItem from './SurveyItem';

type Props = {
  surveys: Array<SurveyEntity>;
  fetching: boolean;
};

const SurveyList = (props: Props) => {
  const { surveys, fetching } = props;
  const surveys_to_render = surveys.map((survey) => (
    <SurveyItem key={survey.id} survey={survey} />
  ));

  const contentToRender = () => {
    if (surveys_to_render.length === 0) {
      return fetching ? (
        <LoadingIndicator loading />
      ) : (
        'Ingen spørreundersøkelser funnet.'
      );
    }
    return surveys_to_render;
  };

  return <div className={styles.surveyList}>{contentToRender()}</div>;
};

export default SurveyList;
