import { CurrentUser } from '~/redux/models/User';
import styles from './style.module.css';
import { useCurrentUser } from '~/redux/slices/auth';

const FredrikPage = () => {
  const user: CurrentUser | undefined = useCurrentUser();

  return (
    <div className={styles.green}>
      Dette er siden til Fredrik!
      <div>Hva er {user?.fullName}?</div>
      <div> -- {user?.gender}</div>
      <div>Er {user?.fullName} med i noen grupper?</div>
      <div> -- Ja, han er med i {user?.abakusGroups}</div>
      <ul>
        <li className={styles.purple}>Hva skjer</li>
        <li className={styles.yellow}>
          Merk: den aller kuleste nye webkommeren
        </li>
      </ul>
    </div>
  );
};

export default FredrikPage;
