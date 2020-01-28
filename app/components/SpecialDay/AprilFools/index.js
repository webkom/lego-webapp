// @flow
import React from 'react';
import styles from './AprilFools.css';
import moment from 'moment-timezone';
import { IndexLink } from 'react-router';
import { Image } from 'app/components/Image';
import logoImage from 'app/assets/logo-dark.png';
import foolsImage from 'app/assets/aprilfools-image.png';
import LoadingBox from './LoadingBox';

type Props = {
  children: Node
};

type State = {
  hasClosed: boolean
};

class AprilFools extends React.Component<Props, State> {
  state = {
    hasClosed: false
  };
  static isCorrectDate() {
    // The year doesn't matter, as it only check month and day of the month
    //const aprilFoolsDate = moment('2019-04-01');
    const aprilFoolsDate = moment('2019-01-28');
    const now = moment();
    return (
      aprilFoolsDate.date() === now.date() &&
      aprilFoolsDate.month() === now.month()
    );
  }

  onQueueDone() {
    localStorage.setItem('hasClosedAprilFools', 'true');
    this.setState({
      hasClosed: true
    });
  }

  componentDidMount() {
    const hasClosedAprilFools = localStorage.getItem('hasClosedAprilFools');
    this.setState({
      hasClosed: hasClosedAprilFools === 'true'
    });
  }

  render() {
    const { children, ...rest } = this.props;
    const { hasClosed } = this.state;

    if (hasClosed) {
      return React.Children.map(children, child =>
        React.cloneElement(child, { ...rest })
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.logoContainer}>
              <IndexLink to="/" className={styles.logo}>
                <Image src={logoImage} alt="" />
              </IndexLink>
            </div>
            <div className={styles.textContainer}>
              <div className={styles.title}>
                VI BEKLAGER{' '}
                <span role="img" aria-label="Sad emoji">
                  🙁
                </span>
              </div>
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
