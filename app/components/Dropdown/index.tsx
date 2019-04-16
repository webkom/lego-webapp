import React, { Component, ReactNode } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Dropdown.css';

interface Props {
  iconName: string;
  toggle: () => any;
  className?: string;
  contentClassName?: string;
  componentClass: any;
  triggerComponent?: ReactNode;
  show: boolean;
  children?: any;
  style?: any;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

class Dropdown extends Component<Props> {
  target: any;

  static defaultProps = {
    iconName: 'star',
    componentClass: 'button',
    placement: 'bottom'
  };

  static ListItem = ListItem;
  static List = List;
  static Divider = Divider;

  renderContent() {
    if (this.props.triggerComponent) {
      return this.props.triggerComponent;
    }

    const { iconName } = this.props;
    return iconName ? <Icon name={iconName} /> : null;
  }

  render() {
    const {
      toggle,
      show,
      contentClassName,
      className,
      children,
      style,
      placement,
      componentClass: ComponentClass
    } = this.props;

    return (
      <ComponentClass
        onClick={toggle}
        ref={target => {
          this.target = target;
        }}
        className={className}
        style={style}
      >
        {this.renderContent()}

        <Overlay
          show={show}
          onHide={toggle}
          target={this.target}
          placement={placement}
          rootClose
          shouldUpdatePosition
        >
          <div className={cx(styles.content, contentClassName || null)}>
            {children}
          </div>
        </Overlay>
      </ComponentClass>
    );
  }
}

function List({ children }: { children: any }) {
  return <ul className={styles.dropdownList}>{children}</ul>;
}

function ListItem(props: any) {
  return <li {...props} />;
}

function Divider() {
  return <li className={styles.divider} />;
}

export default Dropdown;
