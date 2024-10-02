import { useParams } from 'react-router-dom';
import { markUsernamePresent } from 'app/actions/EventActions';
import Validator from 'app/components/UserValidator';
import { selectEventById, selectRegistrationGroups } from 'app/reducers/events';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Abacard.css';
import type { AdministrateEvent } from 'app/store/models/Event';

const Abacard = () => {
  const { eventId } = useParams<{ eventId: string }>() as { eventId: string };
  const event = useAppSelector((state) =>
    selectEventById<AdministrateEvent>(state, eventId),
  );
  const { registered } = useAppSelector((state) =>
    selectRegistrationGroups(state, {
      eventId,
    }),
  );

  const dispatch = useAppDispatch();

  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool,
  ).length;

  const handleSelect = ({ username }: { username: string }) =>
    dispatch(markUsernamePresent(eventId, username));

  return (
    <div>
      <Validator handleSelect={handleSelect} validateAbakusGroup={false} />
      <div className={styles.counter}>
        {registerCount}/{event?.registrationCount || '?'} har møtt opp
      </div>
    </div>
  );
};

export default Abacard;
