/** @flow */

import type { Node, Portal } from 'react';

import { useRef } from 'react';
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

const Dropdown = ({
  iconName = 'star',
  toggle,
  className,
  contentClassName,
  componentClass: ComponentClass = 'button',
  triggerComponent,
  show,
  children,
  style,
  placement = 'bottom',
}: Props) => {
  const triggerRef = useRef(null);

  return (
    <ComponentClass
      onClick={show ? null : toggle} // avoid double toggle because of rootClose
      ref={triggerRef}
      className={className}
      style={style}
    >
      {triggerComponent || (iconName ? <Icon name={iconName} /> : null)}

      <Overlay
        show={show}
        onHide={toggle}
        target={triggerRef}
        placement={placement}
        rootClose
        shouldUpdatePosition
      >
        {({ props }) => (
          <div
            {...props}
            className={cx(styles.content, contentClassName || null)}
          >
            {children}
          </div>
        )}
      </Overlay>
    </ComponentClass>
  );
};

const List = ({ children }: { children: any }): Node => (
  <ul className={styles.dropdownList}>{children}</ul>
);
const ListItem = (props: any): Node => <li {...props} />;
const Divider = (): Node => <li className={styles.divider} />;

Dropdown.List = List;
Dropdown.ListItem = ListItem;
Dropdown.Divider = Divider;

export default Dropdown;
