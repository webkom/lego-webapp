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
  list: boolean,
  childrenContainerRef: ?HTMLDivElement
};

type State = {
  hovered: boolean,
  childrenContainerWidth: number
};

export default class Tooltip extends Component<Props, State> {
  static defaultProps = {
    list: false,
    childrenContainerRef: React.createRef
  };

  tooltip: ?HTMLDivElement;

  measure() {
    const width = this.tooltip.clientWidth;

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
    const { content, children, className, list, style, onClick } = this.props;
    const tooltipClass = this.state.hovered
      ? styles.baseTooltipHover
      : styles.tooltip;
    const tooltip = list ? styles.listTooltip : styles.showTooltip;
    return (
      <div className={className} onClick={onClick}>
        <div
          className={cx(tooltipClass, tooltip)}
          style={{
            ...style,
            marginLeft: this.state.childrenContainerWidth / 2
          }}
        >
          {content}
        </div>
        <div
          ref={ref => {
            this.tooltip = ref;
          }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {children}
        </div>
      </div>
    );
  }
}
