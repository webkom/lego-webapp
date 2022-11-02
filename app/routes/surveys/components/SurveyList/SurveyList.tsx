import styles from "../surveys.css";
import SurveyItem from "./SurveyItem";
import type { SurveyEntity } from "app/reducers/surveys";
import LoadingIndicator from "app/components/LoadingIndicator";
type Props = {
  surveys: Array<SurveyEntity>;
  fetching: boolean;
};

const SurveyList = (props: Props) => {
  const {
    surveys,
    fetching
  } = props;
  const surveys_to_render = surveys.map(survey => <SurveyItem key={survey.id} survey={survey} />);

  const contentToRender = () => {
    if (surveys_to_render.length === 0) {
      return fetching ? <LoadingIndicator loading /> : 'Ingen spørreundersøkelser funnet.';
    } else {
      return surveys_to_render;
    }
  };

  return <div className={styles.surveyList}>{contentToRender()}</div>;
};

export default SurveyList;