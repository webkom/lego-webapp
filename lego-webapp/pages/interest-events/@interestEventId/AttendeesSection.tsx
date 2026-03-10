import { Flex } from '@webkom/lego-bricks';
import styles from './attendeesSection.module.css';
import boxStyles from './boxes.module.css';

export const AttendeesSection = () => {
  return (
    <div className={boxStyles.rightInfoBox}>
      <div className={boxStyles.title}>PÅMELDTE</div>
      <Flex column gap={'var(--spacing-sm)'} width={'100%'}>
        <div className={styles.userIcons}>
          {Array.from({ length: 10 }).map((_, i) => (
            <img
              src="../../../assets/ordinaergenfors2026_ZzXnBwJ.webp"
              key={i}
              alt='Attendee'
              style={{ left: `${i * 9}%` }}
            />
          ))}
        </div>
        <div className={styles.attendeeNames}>
          Vilje, Arash og 117 andre er påmeldt
        </div>
      </Flex>

      <Flex column gap={'var(--spacing-sm)'} width={'100%'}>
        <div className={styles.attendeesProgressInfo}>
          <div>Engasjerte abakuler</div>
          <div>39/100</div>
        </div>
        <div className={styles.attendeesBar}>
          <div className={styles.attendeesBarProgress}></div>
        </div>
      </Flex>
    </div>
  );
};
