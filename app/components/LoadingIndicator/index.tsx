import cx from 'classnames';
import { Component } from 'react';
import styles from './LoadingIndicator.module.css';
import type { ReactNode, CSSProperties } from 'react';

export type Props = {
  loading: boolean;
  small?: boolean;
  margin?: number | string;
  loadingStyle?: CSSProperties;
  children?: ReactNode;
  className?: string;
};
export default class LoadingIndicator extends Component<Props> {
  static defaultProps = {
    loading: false,
  };

  render() {
    const spinnerStyle = this.props.small ? styles.small : styles.spinner;

    if (this.props.loading) {
      return (
        <div
          className={cx(spinnerStyle, this.props.className)}
          style={{ ...this.props.loadingStyle, margin: this.props.margin }}
        >
          <div className={styles.bounce1} />
          <div className={styles.bounce2} />
        </div>
      );
    }

    return this.props.children ? <div>{this.props.children}</div> : null;
  }
}
export const ProgressBar = () => {
  return <div className={styles.progressLine} />;
};
