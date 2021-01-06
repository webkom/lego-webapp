/** @flow */

import type { Node, Portal } from 'react';

import { Component } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Dropdown.css';

type Props = {
  iconName?: string,
  toggle: () => any,
  className?: string,
  contentClassName?: string,
  componentClass?: any,
  triggerComponent?: Node | Portal,
  show: boolean,
  children?: any,
  style?: any,
  placement?: 'top' | 'bottom' | 'left' | 'right',
};

class Dropdown extends Component<Props> {
  target: any;

  static ListItem: (any) => Node = ListItem;
  static List: ({ children: any }) => Node = List;
  static Divider: () => Node = Divider;

  renderContent(): Node {
    if (this.props.triggerComponent) {
      return this.props.triggerComponent;
    }

    const { iconName = 'star' } = this.props;
    return iconName ? <Icon name={iconName} /> : null;
  }

  render(): Node {
    const {
      toggle,
      show,
      contentClassName,
      className,
      children,
      style,
      placement = 'bottom',
      componentClass: ComponentClass = 'button',
    } = this.props;

    return (
      <ComponentClass
        onClick={toggle}
        ref={(target) => {
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

function List({ children }: { children: any }): Node {
  return <ul className={styles.dropdownList}>{children}</ul>;
}

function ListItem(props: any): Node {
  return <li {...props} />;
}

function Divider(): Node {
  return <li className={styles.divider} />;
}

export default Dropdown;
