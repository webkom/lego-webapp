import { Flex, Icon, Image } from '@webkom/lego-bricks';
import {
  Calendar,
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Timer,
} from 'lucide-react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { colorForEventType } from 'app/routes/events/utils';
import { EventStatusType } from 'app/store/models/Event';
import { eventAttendanceAbsolute } from 'app/utils/eventStatus';
import RegistrationStatusTag from './RegistrationStatusTag';
import styles from './styles.module.css';
import type { CompleteEvent, ListEvent } from 'app/store/models/Event';
import type { ReactNode } from 'react';

export type EventStyle = 'default' | 'extra-compact' | 'compact';

type RegistrationIconOptions = {
  icon: ReactNode;
  color: string;
  tooltip: string;
};

const getRegistrationIconOptions = (
  event: Pick<CompleteEvent, 'eventStatusType' | 'isAdmitted'>,
): RegistrationIconOptions => {
  const { isAdmitted, eventStatusType } = event;

  if (isAdmitted) {
    return {
      icon: <CircleCheckBig />,
      color: 'var(--success-color)',
      tooltip: 'Du er påmeldt',
    };
  }

  switch (eventStatusType) {
    case EventStatusType.NORMAL:
    case EventStatusType.INFINITE:
      return {
        icon: <Timer />,
        color: 'var(--color-orange-6)',
        tooltip: 'Du er på ventelisten',
      };
    case EventStatusType.OPEN:
      return {
        icon: <CircleCheckBig />,
        color: 'var(--success-color)',
        tooltip: 'Åpent for alle',
      };
    default:
      return {
        icon: <CircleAlert />,
        color: 'var(--danger-color)',
        tooltip: 'Det har oppstått en feil',
      };
  }
};

const Attendance = ({
  event,
}: {
  event: Parameters<typeof eventAttendanceAbsolute>[0];
}) => {
  const attendance = eventAttendanceAbsolute(event);
  return !!attendance && <Pill>{attendance}</Pill>;
};

type TimeStampProps = {
  event: ListEvent;
};

const TimeStamp = ({ event }: TimeStampProps) => {
  return (
    <Flex column gap="var(--spacing-sm)" className={styles.eventTime}>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Calendar />} size={18} />
        <Time time={event.startTime} format="ll" />
      </Flex>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Clock />} size={18} />
        <Time time={event.startTime} format="HH:mm" />
      </Flex>
    </Flex>
  );
};

const RegistrationIcon = ({ event }: TimeStampProps) => {
  const registrationIconOptions = getRegistrationIconOptions(event);
  return (
    <Tooltip content={registrationIconOptions.tooltip}>
      <Icon
        iconNode={registrationIconOptions.icon}
        size={18}
        style={{ color: registrationIconOptions.color }}
      />
    </Tooltip>
  );
};

type EventItemProps = {
  event: ListEvent;
  showTags?: boolean;
  eventStyle?: EventStyle;
};

const EventItem = ({
  event,
  showTags = true,
  eventStyle,
}: EventItemProps): ReactNode => {
  const isRegistrationOpen = moment(event.activationTime).isBefore(moment());
  // No need to show the year if it is the same year
  const isRegistrationSameYear =
    moment().year() === moment(event.activationTime).year();
  const isEventSameYear = moment().year() === moment(event.startTime).year();

  switch (eventStyle) {
    case 'extra-compact':
      return (
        <Link
          to={`/events/${event.slug}`}
          style={{
            borderColor: colorForEventType(event.eventType),
          }}
          className={styles.eventItem}
        >
          <div>
            <Link to={`/events/${event.slug}`}>
              <h4 className={styles.eventItemTitle}>{event.title}</h4>
            </Link>
            <Time
              time={event.startTime}
              format="ll - HH:mm"
              className={styles.time}
            />
          </div>
          <Flex className={styles.companyLogoExtraCompact}>
            {event.cover && (
              <Image
                alt="Forsidebilde"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </Link>
      );
    case 'compact':
      return (
        <Link
          to={`/events/${event.slug}`}
          style={{ borderColor: colorForEventType(event.eventType) }}
          className={styles.eventItemCompact}
        >
          <h3 className={styles.eventItemTitle}>{event.title}</h3>
          <Flex justifyContent="space-between" gap="var(--spacing-sm)">
            <Flex width="72%" className={styles.companyLogoCompact}>
              {event.cover && (
                <Link to={`/events/${event.slug}`}>
                  <Image
                    src={event.cover}
                    placeholder={event.coverPlaceholder}
                    alt={`Forsidebildet til ${event.title}`}
                  />
                </Link>
              )}
            </Flex>
            <Flex column width="25%" gap="var(--spacing-sm)">
              <Flex wrap alignItems="center" gap="var(--spacing-sm)">
                <RegistrationIcon event={event} />
                <Attendance event={event} />
              </Flex>
              <TimeStamp event={event} />
            </Flex>
          </Flex>
          {showTags && (
            <Flex wrap>
              {event.tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </Flex>
          )}
        </Link>
      );
    case 'default':
    default:
      return (
        <Link
          to={`/events/${event.slug}`}
          style={{
            borderColor: colorForEventType(event.eventType),
          }}
          className={styles.eventItem}
        >
          <Flex column gap="var(--spacing-sm)" className="secondaryFontColor">
            <h3 className={styles.eventItemTitle}>{event.title}</h3>
            {event.totalCapacity != null && event.totalCapacity > 0 && (
              <div>
                <Attendance event={event} />
              </div>
            )}
            <Flex alignItems="center" gap="var(--spacing-sm)">
              <Icon iconNode={<CalendarClock />} size={16} />
              <Time
                time={event.startTime}
                format={isEventSameYear ? 'D. MMM HH:mm' : 'll HH:mm'}
              />
            </Flex>
            {showTags && (
              <Flex wrap>
                {event.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </Flex>
            )}
          </Flex>

          <Flex column alignItems="flex-end" gap="var(--spacing-sm)">
            <Flex className={styles.companyLogo}>
              {event.cover && (
                <Image
                  alt="Forsidebilde"
                  src={event.cover}
                  placeholder={event.coverPlaceholder}
                />
              )}
            </Flex>
            <RegistrationStatusTag
              event={event}
              isRegistrationOpen={isRegistrationOpen}
              isRegistrationSameYear={isRegistrationSameYear}
            />
          </Flex>
        </Link>
      );
  }
};

export default EventItem;
