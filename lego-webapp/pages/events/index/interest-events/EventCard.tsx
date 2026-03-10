import { Icon } from '@webkom/lego-bricks';
import { Calendar, User } from 'lucide-react';
import styles from './EventCard.module.css';

type EventCardProps = {
  title: string;
  date: string;
  attending: number;
  capacity: number;
  image: string;
  link: string;
};

const EventCard = ({
  title,
  date,
  attending,
  capacity,
  image,
  link
}: EventCardProps) => {
  return (
    <a href={link}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src={image} alt="" />
          <div className={`${styles.date} ${styles.icon}`}>
            <Icon iconNode={<Calendar />} size={18} />
            <p>{date}</p>
          </div>
          <div className={styles.capacity}>
            <Icon iconNode={<User />} size={18} />
            <p>
              {' '}
              {attending}/{capacity}
            </p>
          </div>
        </div>
        <div className={styles.title}>
          <p>{title}</p>
        </div>
      </div>
    </a>
  );
};

export default EventCard;
