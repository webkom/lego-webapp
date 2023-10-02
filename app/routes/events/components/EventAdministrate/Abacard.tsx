import { get } from 'lodash';
import type { addToast } from 'app/actions/ToastActions';
import Validator from 'app/components/UserValidator';
import type { EventRegistration, Event } from 'app/models';
import type { UserSearchResult } from 'app/reducers/search';
import styles from './Abacard.css';
import type { Location } from 'history';

type Props = {
  registered: Array<EventRegistration>;
  event: Event;
  clearSearch: () => void;
  markUsernamePresent: (arg0: string, arg1: string) => Promise<any>;
  location: Location;
  onQueryChanged: (arg0: string) => void;
  results: Array<UserSearchResult>;
  searching: boolean;
  addToast: typeof addToast;
};

const Abacard = (props: Props) => {
  const {
    registered,
    event: { id, registrationCount },
    markUsernamePresent,
    ...validatorProps
  } = props;
  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool
  ).length;

  const handleSelect = ({ username }: { username: string }) =>
    markUsernamePresent(id.toString(), username).then(async (result) => {
      const payload = get(result, 'payload.response.jsonData');
      if (payload && payload.error) return result;
      return result;
    });

  return (
    <div>
      <Validator
        {...validatorProps}
        handleSelect={handleSelect}
        validateAbakusGroup={false}
      />
      <div className={styles.counter}>
        {registerCount}/{registrationCount} har møtt opp
      </div>
    </div>
  );
};

export default Abacard;
