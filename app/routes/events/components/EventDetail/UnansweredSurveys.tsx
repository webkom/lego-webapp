import { Card } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import type { PoolRegistrationWithUser } from 'app/reducers/events';
import type { AuthUserDetailedEvent } from 'app/store/models/Event';

interface Props {
  event: AuthUserDetailedEvent;
  currentRegistration?: PoolRegistrationWithUser;
}

export const UnansweredSurveys = ({ event, currentRegistration }: Props) => {
  return (
    <Card severity="danger">
      <p>
        Du kan ikke melde deg {currentRegistration ? 'av' : 'på'} dette
        arrangementet fordi du har ubesvarte spørreundersøkelser. Gå til lenkene
        under for å svare:
      </p>
      <ul>
        {event.unansweredSurveys.map((surveyId, i) => (
          <li key={surveyId}>
            <Link to={`/surveys/${surveyId}`}>Undersøkelse {i + 1}</Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};