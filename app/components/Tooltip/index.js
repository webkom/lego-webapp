import styles from './Tooltip.css';
import React, { Component } from 'react';
import cx from 'classnames';

export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { showToolTip: false };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({
      showToolTip: true
    });
  }

  onMouseLeave() {
    this.setState({
      showToolTip: false
    });
  }

  render() {
    const { content, children, className, list, style } = this.props;
    const tooltipClass = this.state.showToolTip ? styles.baseTooltipHover : styles.tooltip;
    const tooltip = list ? styles.listTooltip : styles.showTooltip;
    return (
      <div
        className={className}
        style={style}
      >
        <div className={cx(tooltipClass, tooltip)}>
          {content}
        </div>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {children}
        </div>
      </div>
    );
  }
}
