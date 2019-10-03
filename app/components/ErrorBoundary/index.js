// @flow
import * as React from 'react';
import Raven from 'raven-js';
import styles from './ErrorBoundary.css';
import awSnap from 'app/assets/sentry-aw-snap.svg';
import { Image } from 'app/components/Image';

type Props = {
  openReportDialog?: boolean,
  children: any,
  hidden?: boolean,
  /* Reset error when this prop changes */
  resetOnChange?: any
};

type State = {
  error: ?Error
};

class ErrorBoundary extends React.Component<Props, State> {
  state = {
    error: null
  };

  openDialog = () => {
    Raven.lastEventId() && Raven.showReportDialog({});
  };

  componentWillReceiveProps(nextProps: Props) {
    const { resetOnChange } = this.props;
    const { error } = this.state;
    if (error && nextProps.resetOnChange !== resetOnChange) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
    if (this.props.openReportDialog) {
      this.openDialog();
    }
  }

  render() {
    const { openReportDialog, hidden = false, children, ...rest } = this.props;

    if (!this.state.error) {
      return React.Children.map(children, child =>
        React.cloneElement(child, { ...rest })
      );
    }
    if (hidden) {
      return null;
    }

    return (
      <div className={styles.container}>
        <div
          className={styles.snap}
          onClick={() => !openReportDialog && this.openDialog()}
        >
          <Image src={awSnap} alt="snap" />
          <div className={styles.message}>
            <h3>En feil har oppstått</h3>
            <p>
              Webkom har <i> ikke </i>fått beskjed om feilen. Gjerne send oss en{' '}
              <a href="mailto:webkom@abakus.no">mail</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
