import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ArrowRight, Check, Share2, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import Time from '~/components/Time';
import useJoinEvent from '~/pages/events/interest/useJoinEvent';
import useMemberGroupIds from '~/pages/events/interest/useMemberGroupIds';
import { activateOnKey, attendanceLabel } from '~/pages/events/interest/utils';
import { useAppSelector } from '~/redux/hooks';
import {
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent,
} from '~/redux/slices/events';
import { appConfig } from '~/utils/appConfig';
import truncateString from '~/utils/truncateString';
import styles from './EventAgenda.module.css';
import EventAttendance from './EventAttendance';
import GroupCircle from './GroupCircle';
import type { ListEvent } from '~/redux/models/Event';

const ShareButton = ({ slug }: { slug: string }) => {
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>();

  const share = () => {
    navigator.clipboard
      .writeText(`${appConfig.webUrl}/events/${slug}`)
      .then(() => {
        clearTimeout(copyTimeout.current);
        setCopied(true);
        copyTimeout.current = setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <button
      type="button"
      className={cx(styles.stripShare, copied && styles.stripShareCopied)}
      title="Del arrangementet"
      onClick={share}
    >
      <span className={styles.stripIconCircle}>
        {copied ? <Check size={14} /> : <Share2 size={14} />}
      </span>
      <span className={styles.stripShareLabel}>
        <span className={styles.stripShareIdle}>Del</span>
        <span className={styles.stripShareDone}>Kopiert!</span>
      </span>
    </button>
  );
};

type Props = {
  event: ListEvent;
  isPast: boolean;
  expanded: boolean;
  onToggle: () => void;
};

const EventRow = ({ event, isPast, expanded, onToggle }: Props) => {
  const group = event.responsibleGroup;
  const memberGroupIds = useMemberGroupIds();
  const isMemberGroup = !!group && memberGroupIds.has(group.id);
  const { joinable, joined, isFull, label, title, onPress } =
    useJoinEvent(event);
  const attendance = attendanceLabel(event);

  const registrations = useAppSelector((state) =>
    selectRegistrationsFromPools(state, event.id),
  );
  const waitingRegistrations = useAppSelector((state) =>
    selectWaitingRegistrationsForEvent(state, event.id),
  );

  return (
    <div
      className={styles.eventWrapper}
      data-expanded={expanded}
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={activateOnKey(onToggle)}
    >
      <div className={styles.eventRow}>
        <GroupCircle group={group} />
        <div className={styles.eventInfo}>
          <div className={styles.eventTitleLine}>
            <span className={styles.eventTitle}>{event.title}</span>
            {group && (
              <span className={styles.eventGroup}>
                {group.name}
                {isMemberGroup && (
                  <span
                    className={styles.memberStar}
                    title="Du er medlem av denne gruppen"
                  >
                    <Star size={12} fill="currentColor" />
                  </span>
                )}
              </span>
            )}
          </div>
          <div className={styles.eventMeta}>
            <Time
              time={event.startTime}
              format={isPast ? 'dddd HH:mm' : 'HH:mm'}
            />{' '}
            · {event.location}
            {attendance && <> · {attendance}</>}
          </div>
        </div>
        {!isPast && joinable && (
          <span onClick={(e) => e.stopPropagation()}>
            {joined ? (
              <button
                type="button"
                title={title}
                className={cx(styles.joinAction, styles.joinedPill)}
                onClick={onPress}
              >
                {label}
                <Check size={14} />
              </button>
            ) : (
              <Button
                size="small"
                secondary={!isFull}
                className={styles.joinAction}
                onPress={onPress}
              >
                {label}
              </Button>
            )}
          </span>
        )}
      </div>
      <div className={styles.eventPanel}>
        <div>
          <div className={styles.eventPanelContent}>
            <div
              className={styles.eventAttendance}
              onClick={(e) => e.stopPropagation()}
            >
              <EventAttendance
                event={event}
                registrations={registrations}
                waitingRegistrations={waitingRegistrations}
                isPast={isPast}
              />
            </div>
            <p className={styles.eventDescription}>
              {truncateString(event.description, 250)}
            </p>
            <div
              className={styles.panelStrip}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                className={styles.stripLink}
                href={`/events/${event.slug}`}
                title="Åpne arrangementssiden"
              >
                <span className={styles.stripIconRail}>
                  <span className={styles.stripIconCircle}>
                    <ArrowRight size={14} />
                  </span>
                </span>
                Se arrangementet
              </a>
              <ShareButton slug={event.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
