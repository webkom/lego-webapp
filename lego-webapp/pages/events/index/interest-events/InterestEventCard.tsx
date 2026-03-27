import { Flex, Icon } from '@webkom/lego-bricks';
import { Calendar, MapPin, Users } from 'lucide-react';
import moment from 'moment-timezone';
import styles from './InterestEventCard.module.css';
import type { ListEvent } from '~/redux/models/Event';
import FillBar from '~/components/FillBar/FillBar';
import { eventAttendanceAbsolute } from '~/utils/eventStatus';

type InterestEventCardProps = {
  event: ListEvent;
};

const InterestEventCard = ({ event }: InterestEventCardProps) => {
  const hasFiniteCapacity =
    typeof event.totalCapacity === 'number' && event.totalCapacity > 0;
  const registrationCount = event.registrationCount ?? 0;
  const attendanceLabel = hasFiniteCapacity
    ? `${registrationCount}/${event.totalCapacity}`
    : eventAttendanceAbsolute(event);

  return (
    <a href={`/events/${event.slug}`} className={styles.link}>
      <Flex className={styles.container} column>
        <div className={styles.imageWrapper}>
          {event.cover ? (
            <img src={event.cover} alt={`Forsidebildet til ${event.title}`} />
          ) : (
            <div className={styles.imageFallback}>{event.title}</div>
          )}
        </div>

        <Flex className={styles.meta} column padding="var(--spacing-md)">
          <h3 className={styles.title}>{event.title}</h3>

          <Flex alignItems="center" gap="var(--spacing-sm)">
            <Icon
              iconNode={<MapPin color="var(--color-yellow-5)" />}
              size={18}
            />
            <p className={styles.location}>{event.location || 'Sted kommer'}</p>
          </Flex>

          <Flex justifyContent="space-between" gap="var(--spacing-md)">
            <Flex className={styles.infoPill} alignItems="center" gap="6px">
              <Icon
                iconNode={<Calendar color="var(--color-yellow-5)" />}
                size={18}
              />
              <p>{moment(event.startTime).format('DD.MM')}</p>
            </Flex>

            <Flex className={styles.infoPill} alignItems="center" gap="6px">
              <Icon
                iconNode={<Users color="var(--color-yellow-5)" />}
                size={18}
              />
              <p>{attendanceLabel}</p>
            </Flex>
          </Flex>

          {hasFiniteCapacity && (
            <FillBar cur={registrationCount} cap={event.totalCapacity} />
          )}
        </Flex>
      </Flex>
    </a>
  );
};

export default InterestEventCard;
