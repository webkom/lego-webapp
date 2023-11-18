import cx from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pill from 'app/components/Pill';
import Popover from 'app/components/Popover';
import TextWithIcon from 'app/components/TextWithIcon';
import Time, { FromToTime } from 'app/components/Time';
import { selectEventsByDay } from 'app/reducers/events';
import { colorForEvent, textColorForEvent } from '../utils';
import styles from './Calendar.css';
import type { RootState } from 'app/store/createRootReducer';
import type { ListEvent } from 'app/store/models/Event';
import type { Moment } from 'moment-timezone';

const renderEvent = (event: ListEvent) => {
  const {
    slug,
    eventType,
    title,
    description,
    totalCapacity,
    registrationCount,
  } = event;

  const startTime = moment(event.startTime);
  const endTime = moment(event.endTime);

  const isPreviousEvent = moment(endTime) < moment();

  const pillColor = colorForEvent(eventType);
  const titleColor = textColorForEvent(eventType);
  return (
    <Popover
      triggerComponent={
        <Link to={`/events/${slug}`}>
          <div
            className={cx(
              styles.eventPill,
              isPreviousEvent && styles.previousEvent
            )}
            style={{ backgroundColor: pillColor }}
          >
            <span className={styles.eventTitle} style={{ color: titleColor }}>
              {title}
            </span>
          </div>
        </Link>
      }
    >
      <h3 className={styles.popoverEventTitle}>
        <span className={styles.popoverEventTitleText}>{title}</span>
        {totalCapacity > 0 && (
          <Pill style={{ marginLeft: 10 }}>
            {`${registrationCount} / ${totalCapacity}`}
          </Pill>
        )}
      </h3>
      <p className={styles.popoverEventDescription}>{description}</p>
      <TextWithIcon
        iconName="time-outline"
        content={
          <strong>
            {moment.duration(endTime.diff(startTime)) <
            moment.duration(1, 'days') ? (
              <span>
                <time>{startTime.format('HH:mm')}</time> -{' '}
                <time>{endTime.format('HH:mm')}</time>
              </span>
            ) : (
              <FromToTime from={event.startTime} to={event.endTime} />
            )}
          </strong>
        }
        className={styles.textWithIcon}
      />
      <TextWithIcon
        iconName="location-outline"
        content={<strong>{event.location}</strong>}
        className={styles.textWithIcon}
      />
      {event.activationTime && (
        <TextWithIcon
          iconName="alarm-outline"
          content={
            <strong>
              Påmelding <Time time={event.activationTime} format="ll HH:mm" />
            </strong>
          }
          className={styles.textWithIcon}
        />
      )}
    </Popover>
  );
};

type Props = {
  day: Moment;
  prevOrNextMonth: boolean;
  events: Array<ListEvent>;
};

const CalendarCell = (props: Props) => {
  const { day, prevOrNextMonth, events } = props;
  return (
    <div
      className={cx(styles.cell, prevOrNextMonth && styles.prevNextMonthDay)}
    >
      <strong
        className={cx(
          styles.dayNumber,
          day.isSame(moment(), 'day') && styles.currentDay
        )}
      >
        {day.date()}
      </strong>
      {events.map(renderEvent)}
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  return {
    events: selectEventsByDay(state, ownProps) as ListEvent[],
  };
};

export default connect(mapStateToProps)(CalendarCell);
