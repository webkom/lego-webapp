// @flow

import React, { Component, type Node } from 'react';
import cx from 'classnames';
import styles from './Tooltip.css';

type Props = {
  children: Node,
  content: Node,
  className?: string,
  onClick?: () => void,
  style?: Object,
  list: boolean
};

type State = {
  hovered: boolean
};

export default class Tooltip extends Component<Props, State> {
  static defaultProps = {
    list: false
  };

  state = {
    hovered: false
  };

  onMouseEnter = () => {
    this.setState({
      hovered: true
    });
  };

  onMouseLeave = () => {
    this.setState({
      hovered: false
    });
  };

  render() {
    const { content, children, className, list, style, onClick } = this.props;
    const tooltipClass = this.state.hovered
      ? styles.baseTooltipHover
      : styles.tooltip;
    const tooltip = list ? styles.listTooltip : styles.showTooltip;
    return (
      <div className={className} onClick={onClick}>
        <div className={cx(tooltipClass, tooltip)} style={style}>
          {content}
        </div>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {children}
        </div>
      </div>
    );
  }
}
