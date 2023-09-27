import _ from 'lodash';
import moment from 'moment-timezone';
import { Component } from 'react';
import walkingImage from 'app/assets/man_walking.gif';
import styles from './LoadingBox.css';

type Props = {
  onQueueDone: () => void;
};
type State = {
  progress: number;
  usersInQueue: number;
  initialDate: moment$Moment;
  initialTimeLeft: number;
  expectedArrivalDate: moment$Moment;
  secondsLeft: number;
  lastUpdateTime: string;
  queueId: string;
};

class LoadingBox extends Component<Props, State> {
  interval?: ReturnType<typeof setInterval>;

  constructor(props: Props) {
    super(props);
    const initialDate = moment();
    // Queue time between 20 and 57 seconds.
    const expectedArrivalDate = moment().add(_.random(20, 57), 'seconds');
    const initialTimeLeft = expectedArrivalDate.diff(initialDate);
    this.state = {
      progress: 0,
      usersInQueue: _.random(48, 231),
      // between 48 and 231
      initialDate,
      initialTimeLeft,
      expectedArrivalDate,
      secondsLeft: Math.floor(initialTimeLeft / 1000),
      lastUpdateTime: initialDate.format('HH:mm:ss'),
      queueId: LoadingBox.randomString(),
    };
  }

  static randomString() {
    return Math.random().toString(36).substring(2, 10);
  }

  updateProgress() {
    const { onQueueDone } = this.props;
    const { secondsLeft, initialTimeLeft, expectedArrivalDate } = this.state;
    let { usersInQueue } = this.state;
    const now = moment();
    const timeLeft = expectedArrivalDate.diff(now);
    const newSecondsLeft = Math.round(timeLeft / 1000);
    const progress = 100 - (100 / initialTimeLeft) * timeLeft;

    if (progress >= 100) {
      clearInterval(this.interval);
      onQueueDone();
      return;
    }

    // Change users in queue every 5 seconds if usersInQueue is higher than 15.
    if (
      secondsLeft !== newSecondsLeft &&
      secondsLeft % 5 === 0 &&
      usersInQueue > 15
    ) {
      // Between 10 and 25
      const randomCount = _.random(10, 25);

      if (usersInQueue > 300) {
        // Max 300 users.
        usersInQueue -= randomCount;
      } else if (usersInQueue < 50) {
        // Min 30 users.
        usersInQueue += randomCount;
      } else {
        // Random subtract/add count.
        usersInQueue += Math.random() >= 0.5 ? randomCount : -randomCount;
      }
    }

    this.setState({
      progress,
      usersInQueue,
      secondsLeft: newSecondsLeft,
      lastUpdateTime: now.format('HH:mm:ss'),
    });
  }

  componentDidMount() {
    this.updateProgress();
    this.interval = setInterval(() => this.updateProgress(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { onQueueDone } = this.props;
    const {
      progress,
      usersInQueue,
      expectedArrivalDate,
      secondsLeft,
      lastUpdateTime,
      queueId,
    } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.whatIsThis} title="Moro 😊">
            Hva er dette?
          </div>
          <div className={styles.skip} onClick={() => onQueueDone()}>
            skip
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div>Brukere i kø: {usersInQueue}</div>
          <div>
            Forventet adgang kl.: {expectedArrivalDate.format('HH:mm:ss')}
          </div>
          <div className={styles.secondsContainer}>
            Du er på websiden om: {secondsLeft} sekunder
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width: `${progress}%`,
              }}
            >
              <div className={styles.runner}>
                <img src={walkingImage} alt="" />
              </div>
            </div>
            <div className={styles.clear} />
          </div>
          <div className={styles.updateTime}>
            <span className={styles.dot} />
            Oppdatert: {lastUpdateTime}
          </div>
        </div>
        <div className={styles.footer}>
          <div>Kø-ID: {queueId}</div>
          <div>Webkom queue system</div>
        </div>
      </div>
    );
  }
}

export default LoadingBox;
