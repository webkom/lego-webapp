import * as Sentry from '@sentry/browser';
import { Card } from '@webkom/lego-bricks';
import { Children, cloneElement, Component } from 'react';
import styles from './ErrorBoundary.css';
import type { ReactNode, ReactElement } from 'react';

type Props = {
  openReportDialog?: boolean;
  children: ReactElement | ReactElement[];
  hidden?: boolean;

  /* Reset error when this prop changes */
  resetOnChange?: any;
};
type State = {
  error: Error | null | undefined;
  lastEventId: string | null | undefined;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
    lastEventId: null,
  };
  openDialog: () => void = () => {
    this.state.lastEventId &&
      Sentry.showReportDialog({
        eventId: this.state.lastEventId,
        lang: 'no',
        title: 'Det skjedde en feil :(',
        subtitle: 'Webkom har fått beskjed.',
        subtitle2:
          'Gjerne beskriv hva som skjedde, så kan vi fikse problemet kjappere.',
      });
  };

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    const { resetOnChange } = this.props;
    const { error } = this.state;

    if (error && nextProps.resetOnChange !== resetOnChange) {
      this.setState({
        error: null,
      });
    }
  }

  componentDidCatch(error: Error, errorInfo: Record<string, any>) {
    this.setState({
      error,
    });

    if (__DEV__) {
      /* eslint no-console: 0 */
      console.error(error);

      /* eslint no-console: 0 */
      console.error(errorInfo);
    }

    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const lastEventId = Sentry.captureException(error);
      this.setState(
        {
          lastEventId,
        },
        () => {
          this.props.openReportDialog && this.openDialog();
        },
      );
    });
  }

  render(): ReactNode {
    const { openReportDialog, hidden = false, children, ...rest } = this.props;

    if (!this.state.error) {
      return Children.map(children, (child) =>
        cloneElement(child, { ...rest }),
      );
    }

    if (hidden) {
      return null;
    }

    return (
      <Card
        severity="danger"
        onClick={() => !openReportDialog && this.openDialog()}
        className={styles.container}
      >
        <Card.Header>En feil har oppstått</Card.Header>
        <p>Webkom har fått beskjed om feilen</p>
      </Card>
    );
  }
}

export default ErrorBoundary;
