// @flow

import React, { Component } from 'react';
import { Position, Portal } from 'react-overlays';
import cx from 'classnames';
import styles from './Popover.css';

type Props = {
  render: () => React.Element<*>,
  children: any,
  placement: 'top'|'bottom'|'left'|'right',
  contentClassName?: string;
};

class Popover extends Component {
  props: Props;

  state = {
    hovered: false
  };

  target: any;

  static defaultProps = {
    placement: 'bottom'
  };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    const { children, placement, contentClassName } = this.props;
    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={(target) => { this.target = target; }}
      >
        {this.props.render && this.props.render()}

        <Portal>
        {this.state.hovered && (
          <Position
            placement={placement}
            target={this.target}
          >
            <div className={cx(styles.content, contentClassName)}>
              {children}
            </div>
          </Position>
        )}
        </Portal>
      </div>
    );
  }
}

export default Popover;
