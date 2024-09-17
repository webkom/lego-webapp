import { Flex, Icon, Image } from '@webkom/lego-bricks';
import {
  AlarmClock,
  Calendar,
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Timer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Pill from 'app/components/Pill';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { colorForEventType } from 'app/routes/events/utils';
import { EventStatusType } from 'app/store/models/Event';
import { eventAttendanceAbsolute } from 'app/utils/eventStatus';
import styles from './styles.css';
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

  switch (eventStatusType) {
    case EventStatusType.NORMAL:
    case EventStatusType.INFINITE:
      if (isAdmitted) {
        return {
          icon: <CircleCheckBig />,
          color: 'var(--success-color)',
          tooltip: 'Du er påmeldt',
        } satisfies RegistrationIconOptions;
      }
      return {
        icon: <Timer />,
        color: 'var(--color-orange-6)',
        tooltip: 'Du er på ventelisten',
      } satisfies RegistrationIconOptions;
    default:
      return {
        icon: <CircleAlert />,
        color: 'var(--danger-color)',
        tooltip: 'Det har oppstått en feil',
      } satisfies RegistrationIconOptions;
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
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Calendar />} size={18} />
        <Time time={event.startTime} format="ll" />
      </Flex>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<Clock />} size={18} />
        <Time time={event.startTime} format="HH:mm" />
      </Flex>
    </div>
  );
};

const TimeStartAndRegistration = ({ event }: TimeStampProps) => {
  return (
    <div className={styles.eventTime}>
      <Flex alignItems="center" gap="var(--spacing-sm)">
        <Icon iconNode={<CalendarClock />} size={18} />
        <Time time={event.startTime} format="ll HH:mm" />
      </Flex>

      {!!event.activationTime && (
        <Flex alignItems="center" gap="var(--spacing-sm)">
          <Tooltip content="Påmelding åpner">
            <Icon iconNode={<AlarmClock />} size={18} />
          </Tooltip>
          <Time time={event.activationTime} format="ll HH:mm" />
        </Flex>
      )}
    </div>
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
  switch (eventStyle) {
    case 'extra-compact':
      return (
        <div
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
        </div>
      );
    case 'compact':
      return (
        <div
          style={{ borderColor: colorForEventType(event.eventType) }}
          className={styles.eventItemCompact}
        >
          <Link to={`/events/${event.slug}`}>
            <h3 className={styles.eventItemTitle}>{event.title}</h3>
          </Link>
          <Flex justifyContent="space-between">
            <Flex width="72%">
              <Flex className={styles.companyLogoCompact}>
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
            </Flex>
            <Flex justifyContent="flex-start" column width="25%">
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
        </div>
      );
    case 'default':
    default:
      return (
        <div
          style={{
            borderColor: colorForEventType(event.eventType),
          }}
          className={styles.eventItem}
        >
          <div>
            <Link to={`/events/${event.slug}`}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>
              {event.totalCapacity > 0 && <Attendance event={event} />}
            </Link>
            <TimeStartAndRegistration event={event} />
            {showTags && (
              <Flex wrap>
                {event.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </Flex>
            )}
          </div>

          <Flex className={styles.companyLogo}>
            {event.cover && (
              <Image
                alt="Forsidebilde"
                src={event.cover}
                placeholder={event.coverPlaceholder}
              />
            )}
          </Flex>
        </div>
      );
  }
};

export default EventItem;
