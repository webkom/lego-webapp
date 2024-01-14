import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import Time from 'app/components/Time';
import { colorForEventType } from 'app/routes/events/utils';
import styles from '../surveys.css';
import type { SelectedSurvey } from 'app/reducers/surveys';

type Props = {
  survey: SelectedSurvey;
};

const SurveyItem = (props: Props) => {
  const { survey } = props;
  return (
    <div
      className={styles.surveyItem}
      style={{
        borderColor: colorForEventType(
          survey.templateType || survey.event.eventType
        ),
      }}
    >
      <div>
        <Link to={`/surveys/${String(survey.id)}`}>
          <h3 className={styles.surveyItemTitle}>{survey.title}</h3>
        </Link>

        {survey.templateType ? (
          <div className={styles.surveyTime}>
            Mal for arrangement av type {String(survey.templateType)}
          </div>
        ) : (
          <div>
            <div className={styles.surveyTime}>
              For arrangement{' '}
              <Link to={`/events/${survey.event.id}`}>
                {survey.event.title}
              </Link>
            </div>

            <div className={styles.surveyTime}>
              Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
            </div>
          </div>
        )}
      </div>

      {!survey.templateType && (
        <div className={styles.companyLogo}>
          <Image
            src={survey.event.cover}
            alt={`Cover image for: ${survey.event.title}`}
          />
        </div>
      )}
    </div>
  );
};

export default SurveyItem;
