import moment from 'moment-timezone';
import { Children, cloneElement, Component } from 'react';
import { Link } from 'react-router-dom';
import foolsImage from 'app/assets/aprilfools-image.png';
import logoImage from 'app/assets/logo-dark.png';
import { Image } from 'app/components/Image';
import styles from './AprilFools.module.css';
import LoadingBox from './LoadingBox';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
type State = {
  hasClosed: boolean;
};

class AprilFools extends Component<Props, State> {
  state = {
    hasClosed: true,
  };

  static isCorrectDate() {
    // The year doesn't matter, as it only check month and day of the month
    const aprilFoolsDate = moment('2019-04-01');
    const now = moment();
    return (
      aprilFoolsDate.date() === now.date() &&
      aprilFoolsDate.month() === now.month()
    );
  }

  onQueueDone() {
    localStorage.setItem('hasClosedAprilFools', 'true');
    this.setState({
      hasClosed: true,
    });
  }

  componentDidMount() {
    const hasClosedAprilFools = localStorage.getItem('hasClosedAprilFools');
    this.setState({
      hasClosed: hasClosedAprilFools === 'true',
    });
  }

  render() {
    const { children, ...rest } = this.props;
    const { hasClosed } = this.state;

    if (hasClosed) {
      return Children.map(children, (child) =>
        cloneElement(child, { ...rest })
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.logoContainer}>
              <Link to="/" className={styles.logo}>
                <Image src={logoImage} alt="" />
              </Link>
            </div>
            <div className={styles.textContainer}>
              <h1>
                VI BEKLAGER{' '}
                <span role="img" aria-label="Sad emoji">
                  🙁
                </span>
              </h1>
              <div className={styles.description}>
                Vi har dessverre
                <i> tekniske &quot;utfordringer&quot; </i>
                på våre nettsider. Vi er lei oss for ulempene dette medfører for
                deg. Det
                <i> &quot;jobbes&quot; </i>
                på spreng for å identifisere problemet.
              </div>
            </div>
            <div>
              <LoadingBox onQueueDone={this.onQueueDone.bind(this)} />
            </div>
          </div>
          <div className={styles.foolsImage}>
            <Image src={foolsImage} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default AprilFools;
