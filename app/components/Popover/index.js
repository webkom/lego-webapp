// @flow

import React, { Component } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import styles from './Popover.css';

type Props = {
  render: () => React.Element<*>,
  children: any,
  placement: 'top' | 'bottom' | 'left' | 'right',
  contentClassName?: string
};

class Popover extends Component {
  props: Props;

  state = {
    contentHovered: false,
    overlayHovered: false
  };

  target: any;

  static defaultProps = {
    placement: 'bottom'
  };

  onMouseEnterContent = () => {
    this.setState({ contentHovered: true });
  };

  onMouseLeaveContent = () => {
    this.setState({ contentHovered: false });
  };

  onMouseEnterOverlay = () => {
    this.setState({ overlayHovered: true });
  };

  onMouseLeaveOverlay = () => {
    this.setState({ overlayHovered: false });
  };

  showOverlay = () => {
    return this.state.contentHovered || this.state.overlayHovered;
  };

  render() {
    const { children, placement, contentClassName } = this.props;

    return (
      <div
        onMouseEnter={this.onMouseEnterContent}
        onMouseLeave={this.onMouseLeaveContent}
        ref={target => {
          this.target = target;
        }}
      >
        {this.props.render && this.props.render()}

        {this.showOverlay() && (
          <Overlay show placement={placement} target={this.target}>
            <div
              onMouseEnter={this.onMouseEnterOverlay}
              onMouseLeave={this.onMouseLeaveOverlay}
              className={cx(styles.content, contentClassName)}
            >
              {children}
            </div>
          </Overlay>
        )}
      </div>
    );
  }
}

export default Popover;
