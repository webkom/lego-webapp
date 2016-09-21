import styles from './Tooltip.css';
import React, { Component } from 'react';
import cx from 'classnames';

export default class Tooltip extends Component {

  state = {
    showToolTip: false
  }

  onMouseEnter = () => {
    this.setState({
      showToolTip: true
    });
  }

  onMouseLeave = () => {
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
        <div
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          {children}
        </div>
      </div>
    );
  }
}
