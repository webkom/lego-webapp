// @flow
import * as React from 'react';
import Raven from 'raven-js';
import styles from './ErrorBoundary.css';
import awSnap from 'app/assets/sentry-aw-snap.svg';

type Props = {
  openReportDialog?: boolean,
  children: any,
  hidden?: boolean
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

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
    if (this.props.openReportDialog) {
      this.openDialog();
    }
  }

  render() {
    const { openReportDialog, hidden = false, children, ...rest } = this.props;
    if (this.state.error) {
      return hidden ? null : (
        <div className={styles.container}>
          <div
            className={styles.snap}
            onClick={() => !openReportDialog && this.openDialog()}
          >
            <img src={awSnap} alt="snap" />
            <div className={styles.message}>
              <h3>En feil har oppstått</h3>
              <p>
                Webkom har fått beskjed om feilen.{' '}
                {!openReportDialog &&
                  Raven.lastEventId() && (
                    <span>
                      Klikk <b>her</b> for å sende en rapport.
                    </span>
                  )}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return React.cloneElement(children, rest);
    }
  }
}

export default ErrorBoundary;
