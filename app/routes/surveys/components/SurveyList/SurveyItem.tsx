import { Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { selectEventById } from 'app/reducers/events';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import styles from '../surveys.module.css';
import type { EventForSurvey } from 'app/store/models/Event';
import type { DetailedSurvey } from 'app/store/models/Survey';

type Props = {
  survey: DetailedSurvey;
};

const SurveyItem = ({ survey }: Props) => {
  const event = useAppSelector((state) =>
    selectEventById<EventForSurvey>(state, survey.event),
  );

  return (
    <div
      className={cx(styles.surveyItem, styles.surveyItemBorder)}
      style={{
        borderColor: colorForEventType(survey.templateType || event?.eventType),
      }}
    >
      <div>
        <Link to={`/surveys/${String(survey.id)}`}>
          <h3 className={styles.surveyItemTitle}>{survey.title}</h3>
        </Link>

        {survey.isTemplate ? (
          <div className={styles.surveyTime}>
            Mal for med tittel {survey.title}
          </div>
        ) : (
          <div>
            <div className={styles.surveyTime}>
              For arrangement{' '}
              <Link to={`/events/${event?.id}`}>{event?.title}</Link>
            </div>

            <div className={styles.surveyTime}>
              Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
            </div>
          </div>
        )}
      </div>

      {!survey.templateType && (
        <div className={styles.companyLogo}>
          <Image src={event?.cover} alt={`Forsidebildet til ${event?.title}`} />
        </div>
      )}
    </div>
  );
};

export default SurveyItem;
