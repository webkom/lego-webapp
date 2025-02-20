import { Card } from '@webkom/lego-bricks';
import { Link } from 'react-router';
import styles from './EventDetail.module.css';
import type { AuthUserDetailedEvent } from '~/redux/models/Event';
import type { PoolRegistrationWithUser } from '~/redux/slices/events';

interface Props {
  event: AuthUserDetailedEvent;
  currentRegistration?: PoolRegistrationWithUser;
}

export const UnansweredSurveys = ({ event, currentRegistration }: Props) => {
  return (
    <Card severity="danger" className={styles.card}>
      <p>
        Du kan ikke melde deg {currentRegistration ? 'av' : 'på'} dette
        arrangementet fordi du har ubesvarte spørreundersøkelser. Gå til lenkene
        under for å svare:
      </p>
      <ul>
        {event.unansweredSurveys.map((surveyId, i) => (
          <li key={surveyId}>
            <Link to={`/surveys/${surveyId}/answer`}>Undersøkelse {i + 1}</Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};
