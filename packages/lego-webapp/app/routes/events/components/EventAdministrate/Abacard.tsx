import { useParams } from 'react-router';
import Validator from 'app/components/UserValidator';
import { markUsernamePresent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectEventById,
  selectRegistrationGroups,
} from '~/redux/slices/events';
import styles from './Abacard.module.css';
import type { AdministrateEvent } from '~/redux/models/Event';

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
