import React, { Component } from 'react';
import cx from 'classnames';
import styles from './Tooltip.css';

export default class Tooltip extends Component {
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
      <div className={className} style={style} onClick={onClick}>
        <div className={cx(tooltipClass, tooltip)}>{content}</div>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {children}
        </div>
      </div>
    );
  }
}
