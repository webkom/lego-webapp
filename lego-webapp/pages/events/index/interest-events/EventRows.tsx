import EventCard from "./EventCard";
import styles from './EventRows.module.css';
import norwayFlag from '~/assets/flags/norway.svg';


type EventRowsProps = {
  title: string;
};

const EventRows = ({
  title
}: EventRowsProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <h4>Vis Alle</h4>
      <div className={styles.container}>
        <EventCard
          title="Arrangement 1"
          date="20.10"
          attending={50}
          capacity={100}
          image={norwayFlag}
          link="#"
        />
        <EventCard
          title="Arrangement 1"
          date="20.10"
          attending={50}
          capacity={100}
          image={norwayFlag}
          link="#"
        />
      </div>
    </div>
  );
};

export default EventRows;
