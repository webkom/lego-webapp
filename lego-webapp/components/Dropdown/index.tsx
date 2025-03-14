import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useRef } from 'react';
import { Overlay } from 'react-overlays';
import styles from './Dropdown.module.css';
import type { ReactNode, ReactPortal, HTMLAttributes } from 'react';
import type { DOMContainer } from 'react-overlays/useWaitForDOMRef';

type Props = {
  iconName?: string;
  toggle: () => any;
  closeOnContentClick?: boolean;
  className?: string;
  contentClassName?: string;
  componentClass?: any;
  triggerComponent?: ReactNode | ReactPortal;
  show: boolean;
  children?: ReactNode;
  style?: Record<string, string>;
  rootClose?: boolean;
  container?: DOMContainer;
};

const Dropdown = ({
  iconName,
  toggle,
  closeOnContentClick = false,
  className,
  contentClassName,
  componentClass: ComponentClass = iconName ? 'div' : 'button',
  triggerComponent,
  show,
  children,
  style,
  rootClose,
  container,
}: Props) => {
  const triggerRef = useRef(null);

  return (
    <ComponentClass
      onClick={show && !iconName ? undefined : toggle} // avoid double toggle because of rootClose
      ref={triggerRef}
      className={className}
      style={style}
      data-test-id="dropdown"
    >
      {triggerComponent ||
        (iconName ? (
          <Icon name={iconName} onPress={show ? () => {} : toggle} />
        ) : null)}

      <Overlay
        show={show}
        onHide={toggle}
        target={triggerRef}
        placement="bottom"
        rootClose={rootClose ?? true}
        container={container}
      >
        {({ props, arrowProps }) => (
          <div
            {...props}
            className={cx(styles.content, contentClassName || null)}
            onClick={closeOnContentClick ? toggle : undefined}
          >
            {/*eslint-disable-next-line */}
            {/*@ts-ignore The css TS plugin does not understand our css alias imports*/}
            <div {...arrowProps} className={styles.arrow} />
            {children}
          </div>
        )}
      </Overlay>
    </ComponentClass>
  );
};

type ListProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLUListElement>;

const List = ({ children, className }: ListProps) => (
  <ul className={cx(className, styles.dropdownList)}>{children}</ul>
);

type ListItemProps = {
  active?: boolean;
  danger?: boolean;
} & HTMLAttributes<HTMLLIElement>;

const ListItem = ({ active, danger, ...props }: ListItemProps) => (
  <li
    className={cx(active && styles.active, danger && styles.danger)}
    {...props}
  />
);

const Divider = () => <li className={styles.divider} />;

Dropdown.List = List;
Dropdown.ListItem = ListItem;
Dropdown.Divider = Divider;
export default Dropdown;
