import { Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import Time from '~/components/Time';
import { colorForEventType } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { EventForSurvey, EventType } from '~/redux/models/Event';
import { selectEventById } from '~/redux/slices/events';
import styles from '../components/surveys.module.css';
import type { DetailedSurvey } from '~/redux/models/Survey';

type Props = {
  survey: DetailedSurvey;
};

const SurveyItem = ({ survey }: Props) => {
  const event = useAppSelector((state) =>
    selectEventById<EventForSurvey>(state, survey?.event),
  );

  return (
    <div
      className={cx(styles.surveyItem, styles.surveyItemBorder)}
      style={{
        borderColor: colorForEventType(
          survey.templateType || event?.eventType || EventType.COURSE,
        ),
      }}
    >
      <div>
        <a href={`/surveys/${String(survey.id)}`}>
          <h3 className={styles.surveyItemTitle}>{survey.title}</h3>
        </a>

        {survey.isTemplate ? (
          <div className={styles.surveyTime}>
            Mal for med tittel {survey.title}
          </div>
        ) : (
          <div>
            <div className={styles.surveyTime}>
              For arrangement{' '}
              <a href={`/events/${event?.id}`}>{event?.title}</a>
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
