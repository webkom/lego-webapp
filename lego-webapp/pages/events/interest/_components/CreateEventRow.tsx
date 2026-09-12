import { Flex, LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Plus } from 'lucide-react';
import styles from './EventAgenda.module.css';

const CreateEventRow = () => (
  <div className={styles.dayRow}>
    <Flex column justifyContent="center" className={styles.dayLabel}>
      <div className={cx(styles.dayName, styles.dayNameMuted)}>Når da?</div>
      <div className={styles.dayDate}>Løpetur eller cava?</div>
    </Flex>
    <div className={styles.createRow}>
      <span className={styles.createCircle} aria-hidden>
        <Plus size={17} />
      </span>
      <span className={styles.createTitle}>Lag et arrangement</span>
      <LinkButton
        size="small"
        dashed
        href="/events/interest/new"
        className={styles.createAction}
      >
        Opprett
      </LinkButton>
    </div>
  </div>
);

export default CreateEventRow;
