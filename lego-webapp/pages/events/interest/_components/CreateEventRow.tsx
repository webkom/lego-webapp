import { LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Plus } from 'lucide-react';
import { navigate } from 'vike/client/router';
import { activateOnKey } from '~/pages/events/interest/utils';
import styles from './EventAgenda.module.css';

const goToCreateEvent = () => navigate('/events/new');

const CreateEventRow = () => (
  <div className={styles.dayRow}>
    <div className={styles.dayLabel}>
      <div className={cx(styles.dayName, styles.dayNameMuted)}>Din tur?</div>
      <div className={styles.dayDate}>når det passer deg</div>
    </div>
    <div
      className={styles.createRow}
      role="button"
      tabIndex={0}
      onClick={goToCreateEvent}
      onKeyDown={activateOnKey(goToCreateEvent)}
    >
      <span className={styles.createCircle} aria-hidden>
        <Plus size={17} />
      </span>
      <span className={styles.createTitle}>Lag et arrangement</span>
      <span onClick={(e) => e.stopPropagation()}>
        <LinkButton
          size="small"
          dashed
          href="/events/new"
          className={styles.createAction}
        >
          Opprett
        </LinkButton>
      </span>
    </div>
  </div>
);

export default CreateEventRow;
