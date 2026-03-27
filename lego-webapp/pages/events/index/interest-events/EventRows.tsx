import InterestEventCard from './InterestEventCard';
import styles from './EventRows.module.css';
import type { ListEvent } from '~/redux/models/Event';

type EventRowsProps = {
  title: string;
  events: ListEvent[];
};

const EventRows = ({ title, events }: EventRowsProps) => {
  return (
    <div className={styles.outerContainer}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.container}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <InterestEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRows;
