import { useCurrentUser } from '~/redux/slices/auth';
import styles from './style.module.css';
const Content = () => {
  const user = useCurrentUser();
  return (
    <div className={styles.main}>
      <h1>{user?.fullName}</h1>
      <p className={styles.red}>
        Merk!!!!: den aller aller kuleste nye webkommeren
      </p>
    </div>
  );
};
export default Content;
