import { usePreparedEffect } from '@webkom/react-prepare';
import { get } from 'lodash';
import qs from 'qs';
import { useLocation, useParams } from 'react-router-dom';
import { markUsernamePresent } from 'app/actions/EventActions';
import { autocomplete } from 'app/actions/SearchActions';
import Validator from 'app/components/UserValidator';
import { getRegistrationGroups, selectEventById } from 'app/reducers/events';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Abacard.css';

const Abacard = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) => selectEventById(state, { eventId }));
  const { registered } = useAppSelector((state) =>
    getRegistrationGroups(state, {
      eventId,
    })
  );

  const location = useLocation();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEventAbacard',
    () => {
      if (query && typeof query === 'string') {
        return dispatch(autocomplete(query, ['users.user']));
      }
    },
    [query]
  );

  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool
  ).length;

  const handleSelect = ({ username }: { username: string }) =>
    dispatch(markUsernamePresent(eventId, username)).then((result) => {
      const payload = get(result, 'payload.response.jsonData');
      if (payload && payload.error) return result;
      return result;
    });

  return (
    <div>
      <Validator handleSelect={handleSelect} validateAbakusGroup={false} />
      <div className={styles.counter}>
        {registerCount}/{event.registrationCount || '?'} har møtt opp
      </div>
    </div>
  );
};

export default Abacard;
