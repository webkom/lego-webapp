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
  list?: boolean,
  renderToThe?: string,
  pointerToThe?: string
};

type State = {
  hovered: boolean,
  childrenContainerWidth: number
};

/**
 * A tooltip that appears when you hover over the component placed within.
 * The tooltip will by default be centered, however it supports a 'renderToThe'
 * prop that will make it render either to the left. The pointer
 * (the small arrow that points towards the component within the tooltip) will
 * also default to center, and it can be adjusted with the 'pointerToThe' prop.
 * Both props can be set as either 'left' or 'right'.
 */

export default class Tooltip extends Component<Props, State> {
  static defaultProps = {
    list: false
  };

  tooltip: ?HTMLDivElement;

  measure() {
    if (!this.tooltip) {
      return;
    }
    const width = this.tooltip.offsetWidth;

    this.setState({
      childrenContainerWidth: width
    });
  }

  state = {
    hovered: false,
    childrenContainerWidth: 0
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

  componentDidMount() {
    this.measure();
  }

  render() {
    const {
      content,
      children,
      className,
      list,
      style,
      onClick,
      renderToThe,
      pointerToThe
    } = this.props;
    let renderToTheClass = styles.renderFromCenter;
    if (!list) {
      switch (renderToThe) {
        case 'left':
          renderToTheClass = styles.renderToTheLeft;
          break;
        case 'right':
          renderToTheClass = styles.renderToTheRight;
          break;
      }
    }
    let startPointChildren = 2;
    if (!list) {
      switch (pointerToThe) {
        case 'left':
          startPointChildren = 9;
          break;
        case 'right':
          startPointChildren = 10 / 9;
          break;
      }
    }
    const tooltipClass = this.state.hovered
      ? styles.baseTooltipHover
      : styles.tooltip;
    const tooltip = list ? styles.listTooltip : styles.showTooltip;
    return (
      <div className={className} onClick={onClick}>
        <div
          ref={ref => {
            this.tooltip = ref;
          }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div
            className={cx(tooltipClass, tooltip, renderToTheClass)}
            style={{
              ...style,
              marginLeft:
                this.state.childrenContainerWidth / startPointChildren - 5
            }}
          >
            {content}
          </div>
          {children}
        </div>
      </div>
    );
  }
}
