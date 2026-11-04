import { Card, Flex, Icon, Image, Tooltip } from '@webkom/lego-bricks';
import {
  Calendar,
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Timer,
  Users,
  MapPin,
} from 'lucide-react';
import moment from 'moment-timezone';
import Pill from '~/components/Pill';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { colorForEventType } from '~/pages/events/utils';
import { EventStatusType } from '~/redux/models/Event';
import { eventAttendanceAbsolute } from '~/utils/eventStatus';
import RegistrationStatusTag from './RegistrationStatusTag';
import styles from './styles.module.css';
import type { ReactNode } from 'react';
import type {
  CompleteEvent,
  FrontpageEvent,
  ListEvent,
} from '~/redux/models/Event';

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
  const attendance =
    event.totalCapacity === 0
      ? 'Åpent for Alle'
      : eventAttendanceAbsolute(event);
  return (
    <Pill className={styles.attendance}>
      <Icon iconNode={<Users />} size={14} />
      {attendance}
    </Pill>
  );
};

type RegistrationIconProps = {
  event: ListEvent | FrontpageEvent;
};

type TimeStampProps = RegistrationIconProps & { hasCover: boolean };

const TimeStamp = ({ event, hasCover }: TimeStampProps) => {
  return (
    <Flex
      column={hasCover}
      gap="var(--spacing-sm)"
      className={styles.eventTime}
    >
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

const RegistrationIcon = ({ event }: RegistrationIconProps) => {
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
  event: ListEvent | FrontpageEvent;
  showTags?: boolean;
  eventStyle?: EventStyle;
};

const EventItem = ({
  event,
  showTags = event.totalCapacity !== 0,
  eventStyle,
}: EventItemProps): ReactNode => {
  const isRegistrationOpen = moment(event.activationTime).isBefore(moment());
  // No need to show the year if it is the same year
  const isRegistrationSameYear =
    moment().year() === moment(event.activationTime).year();
  const isEventSameYear = moment().year() === moment(event.startTime).year();
  const hasCover = event.cover ? true : false;

  switch (eventStyle) {
    case 'extra-compact':
      return (
        <a
          href={`/events/${event.slug}`}
          className={styles.eventItemExtraCompact}
        >
          <Card className={styles.card} isHoverable>
            <div
              style={{
                backgroundColor: colorForEventType(event.eventType),
              }}
              className={styles.bar}
            ></div>
            <Flex column className={styles.info}>
              <h3 className={styles.eventItemTitleCompact}>{event.title}</h3>

              <Flex className={styles.lowerInfoCompact} gap="var(--spacing-md)">
                <Flex alignItems="center" gap="var(--spacing-sm)">
                  <Icon iconNode={<CalendarClock />} size={16} />
                  <Time
                    time={event.startTime}
                    format={isEventSameYear ? 'D. MMM HH:mm' : 'll HH:mm'}
                  />
                </Flex>
                <Flex
                  className={styles.locationInfo}
                  alignItems="center"
                  gap="var(--spacing-sm)"
                >
                  <Icon iconNode={<MapPin />} size={16} />
                  <span className={styles.location}>{event.location}</span>
                </Flex>
              </Flex>
            </Flex>
            <Flex alignItems="flex-end" gap="var(--spacing-sm)">
              {event.cover && (
                <div className={styles.borderExtraCompact}>
                  <Image
                    alt="Forsidebilde"
                    src={event.cover}
                    placeholder={event.coverPlaceholder}
                  />
                </div>
              )}
            </Flex>
          </Card>
        </a>
      );
    case 'compact':
      return (
        <a
          href={`/events/${event.slug}`}
          style={{ borderColor: colorForEventType(event.eventType) }}
          className={styles.eventItemCompact}
        >
          <h3 className={styles.eventItemTitle}>{event.title}</h3>
          <Flex justifyContent="space-between" gap="var(--spacing-sm)">
            {event.cover && (
              <Flex width="72%" className={styles.companyLogoCompact}>
                {event.cover && (
                  <Image
                    src={event.cover}
                    placeholder={event.coverPlaceholder}
                    alt={`Forsidebildet til ${event.title}`}
                  />
                )}
              </Flex>
            )}
            <Flex
              column={hasCover}
              width={hasCover ? '25%' : '100%'}
              gap="var(--spacing-sm)"
            >
              <Flex wrap alignItems="center" gap="var(--spacing-sm)">
                <RegistrationIcon event={event} />
                <Attendance event={event} />
              </Flex>
              <TimeStamp event={event} hasCover={hasCover} />
            </Flex>
          </Flex>
          {showTags && (
            <Flex wrap>
              {event.tags.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </Flex>
          )}
        </a>
      );
    case 'default':
    default:
      return (
        <a href={`/events/${event.slug}`} className={styles.eventItem}>
          <Card className={styles.card} isHoverable>
            <div
              style={{
                backgroundColor: colorForEventType(event.eventType),
              }}
              className={styles.bar}
            ></div>
            <Flex column className={styles.info}>
              <h3 className={styles.eventItemTitle}>{event.title}</h3>

              <Flex className={styles.lowerInfo} column>
                <Flex alignItems="center" gap="var(--spacing-sm)">
                  <Icon iconNode={<CalendarClock />} size={16} />
                  <Time
                    time={event.startTime}
                    format={isEventSameYear ? 'D. MMM HH:mm' : 'll HH:mm'}
                  />
                </Flex>
                <Flex alignItems="center" gap="var(--spacing-sm)">
                  <Icon iconNode={<MapPin />} size={16} />
                  {event.location}
                </Flex>
              </Flex>
              <Flex gap="var(--spacing-sm)">
                <Attendance event={event} />
                {showTags && (
                  <RegistrationStatusTag
                    event={event}
                    isRegistrationOpen={isRegistrationOpen}
                    isRegistrationSameYear={isRegistrationSameYear}
                  />
                )}
              </Flex>
            </Flex>
            <Flex alignItems="flex-end" gap="var(--spacing-sm)">
              {event.cover && (
                <div className={styles.border}>
                  <Image
                    alt="Forsidebilde"
                    src={event.cover}
                    placeholder={event.coverPlaceholder}
                  />
                </div>
              )}
            </Flex>
          </Card>
        </a>
      );
  }
};

export default EventItem;
