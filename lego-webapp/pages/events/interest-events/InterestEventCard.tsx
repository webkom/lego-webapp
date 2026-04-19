import { Flex, Image } from '@webkom/lego-bricks';
import { MapPin } from 'lucide-react';
import moment from 'moment-timezone';
import styles from './InterestEventCard.module.css';
import type { ListEvent } from '~/redux/models/Event';

type Props = {
  event: ListEvent;
};

const InterestEventCard = ({ event }: Props) => {
  const hasCapacity =
    typeof event.totalCapacity === 'number' && event.totalCapacity > 0;
  const registrationCount = event.registrationCount ?? 0;

  return (
    <a href={`/events/${event.slug}`} className={styles.card}>
      <Flex className={styles.container} column>
        <div className={styles.imageContainer}>
          {event.cover && (
            <Image
              src={event.cover}
              alt={`Forsidebildet til ${event.title}`}
              placeholder={event.coverPlaceholder}
            />
          )}
          <Flex className={styles.infoTop} justifyContent="space-between">
            <span className={styles.badge}>
              {moment(event.startTime).format('D. MMM · HH:mm')}
            </span>
            {hasCapacity && (
              <span className={styles.badge}>
                {registrationCount}/{event.totalCapacity}
              </span>
            )}
          </Flex>
          <div className={styles.bottomOverlay}>
            {event.location && (
              <Flex className={styles.location} alignItems="center" gap="4px">
                <MapPin size={11} color="rgba(255,255,255,0.8)" />
                <span>{event.location}</span>
              </Flex>
            )}
            <Flex gap="var(--spacing-xs)">
              <span className={styles.registerBtn}>Meld på</span>
              <span className={styles.infoBtn}>Info</span>
            </Flex>
          </div>
        </div>
        <Flex className={styles.infoBottom} column>
          <h4 className={styles.title}>{event.title}</h4>
          {event.responsibleGroup && (
            <p className={styles.group}>{event.responsibleGroup.name}</p>
          )}
        </Flex>
      </Flex>
    </a>
  );
};

export default InterestEventCard;
