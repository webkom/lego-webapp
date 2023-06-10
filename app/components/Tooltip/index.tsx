import cx from 'classnames';
import { Component } from 'react';
import styles from './Tooltip.module.css';
import type { ReactNode, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  list?: boolean;
  renderDirection?: string;
  pointerPosition?: string;
};
type State = {
  hovered: boolean;
  childrenContainerWidth: number;
};
/**
 * A tooltip that appears when you hover over the component placed within.
 * The tooltip will by default be centered, however it supports a 'renderDirection'
 * prop that will make it render either to the left or the right from the postion of the pointer. The pointer
 * (the small arrow that points towards the component within the tooltip) will
 * also default to center, and it can be adjusted with the 'pointerPosition' prop.
 * Both props can be set as either 'left' or 'right'.
 */

export default class Tooltip extends Component<Props, State> {
  static defaultProps = {
    list: false,
  };
  tooltip: HTMLDivElement | null | undefined;

  measure() {
    if (!this.tooltip) {
      return;
    }

    const width = this.tooltip.offsetWidth;
    this.setState({
      childrenContainerWidth: width,
    });
  }

  state = {
    hovered: false,
    childrenContainerWidth: 0,
  };
  onMouseEnter = () => {
    this.setState({
      hovered: true,
    });
  };
  onMouseLeave = () => {
    this.setState({
      hovered: false,
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
      renderDirection,
      pointerPosition,
    } = this.props;
    let renderDirectionClass = styles.renderFromCenter;
    let startPointChildren = 2;

    if (!list) {
      switch (renderDirection) {
        case 'left':
          renderDirectionClass = styles.renderDirectionLeft;
          break;

        case 'right':
          renderDirectionClass = styles.renderDirectionRight;
          break;

        default:
          break;
      }

      switch (pointerPosition) {
        case 'left':
          startPointChildren = 9;
          break;

        case 'right':
          startPointChildren = 10 / 9;
          break;

        default:
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
          ref={(ref) => {
            this.tooltip = ref;
          }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div
            className={cx(tooltipClass, tooltip, renderDirectionClass)}
            style={{
              ...style,
              marginLeft:
                this.state.childrenContainerWidth / startPointChildren - 5,
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
