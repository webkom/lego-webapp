import { Clock } from 'lucide-react';
import styles from './attendSection.module.css';
import boxStyles from './boxes.module.css';

export const AttendSection = () => {
  return (
    <div className={boxStyles.rightInfoBox}>
      <div className={boxStyles.title}>PÅMELDING</div>

      <span>Du er ikke påmeldt</span>

      <button className={styles.attendButton}>Meld deg på</button>
      <div>
        Ved å melde deg på samtykker du til arrangementreglene
      </div>
      <div className={styles.attendBottomInfo}>
        <Clock className={styles.timeInfoIcon} />
        Påmelding stenger ons 18. feb. 14:15 <br />
      </div>
    </div>
  );
};
