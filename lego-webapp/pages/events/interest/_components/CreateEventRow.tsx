import { Flex, LinkButton, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Plus } from 'lucide-react';
import styles from './EventAgenda.module.css';

const CreateEventRow = () => (
  <div className={styles.dayRow}>
    <Flex column justifyContent="center" className={styles.dayLabel}>
      <div className={cx(styles.dayName, styles.dayNameMuted)}>Når da?</div>
    </Flex>
    <div className={styles.createRow}>
      <LinkButton
        round
        href="/events/interest/new"
        className={styles.createCircle}
      >
        <Icon iconNode={<Plus />} size={20} />
      </LinkButton>
      <span className={styles.createTitle}>Lag ny arrangement</span>
    </div>
  </div>
);

export default CreateEventRow;
