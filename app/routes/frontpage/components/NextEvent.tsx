import { Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import { selectEvents } from 'app/reducers/events';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import styles from './NextEvent.css';
import type { FrontpageEvent } from 'app/store/models/Event';

type Props = {
  event: FrontpageEvent;
};
type State = {
  time: string;
};

class EventItem extends Component<Props, State> {
  state = {
    time: this.constructor.generateTime(this.props),
  };
  interval?: ReturnType<typeof setInterval>;

  static generateTime(props: Props) {
    const now = moment();
    const start = moment(props.event && props.event.activationTime);
    const time = now.to(start);
    // If it's 1 day left we would like to say 'i morgen' and not 1 day
    const isTomorrow = moment().add('1', 'day').isSame(start, 'day');
    return isTomorrow ? 'i morgen' : time;
  }

  updateTime() {
    this.setState({
      time: EventItem.generateTime(this.props),
    });
  }

  componentDidMount() {
    this.updateTime();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const selected = this.props.event;
    const activeString = moment(selected.activationTime).format('LLLL');
    return (
      <Tooltip content={`Påmelding: ${activeString}`}>
        <Flex
          column
          style={{
            borderColor: colorForEventType(selected.eventType),
          }}
          className={styles.eventItem}
        >
          <Link to={`/events/${selected.slug}`} className={styles.title}>
            <h4>{truncateString(selected.title, 43)}</h4>
          </Link>

          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.info}
          >
            <Icon name="alarm-outline" size={20} />
            <div>
              <span>
                Påmelding {/*Change based on time*/}
                {moment().isBefore(selected.activationTime) ? 'åpner' : 'åpnet'}
              </span>
              <span className={styles.time}>
                {/*Add for if the moment has passed*/}
                {moment().isAfter(selected.activationTime) && 'for '}
                {/*Minutter is too long of string*/}
                {this.state.time.replace('minutter', 'min')}
              </span>
            </div>
          </Flex>
        </Flex>
      </Tooltip>
    );
  }
} // Component when there is no events

const Filler = () => (
  <Flex column className={styles.filler}>
    <Icon
      name="eye-off-outline"
      size={40}
      style={{
        marginRight: '5px',
      }}
    />
    <span>Ingen påmeldinger de neste 3 dagene</span>
  </Flex>
);

// Filter for activation
const hasActivation = (event: FrontpageEvent) => event.activationTime !== null;

// Filter for range
const inRange = (event: FrontpageEvent) => {
  const start = moment(event && event.activationTime);
  return (
    // Check that the date is within 3 days
    start.isSameOrBefore(moment().add(3, 'days'), 'day') && // Check that the date is the same day
    start.isSameOrAfter(moment(), 'day')
  );
};

const NEXT_EVENTS_LIMIT = 2;

const NextEvent = () => {
  const events = useAppSelector(selectEvents) as unknown as FrontpageEvent[];

  // Sorted events based on activationTime, take out the
  // ones that are out of range
  const orderedEvents = events
    .filter(hasActivation)
    .filter(inRange)
    .sort((a, b) => moment(a.activationTime).diff(moment(b.activationTime)))
    .splice(0, NEXT_EVENTS_LIMIT);

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  return (
    <div className={styles.wrapper}>
      {fetching && !events.length ? (
        <Skeleton array={NEXT_EVENTS_LIMIT} className={styles.eventItem} />
      ) : orderedEvents.length > 0 ? (
        orderedEvents.map((event) => <EventItem key={event.id} event={event} />)
      ) : (
        <Filler />
      )}
    </div>
  );
};

export default NextEvent;
