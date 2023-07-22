import cx from 'classnames';
import { useRef } from 'react';
import { Overlay } from 'react-overlays';
import Icon from 'app/components/Icon';
import styles from './Dropdown.css';
import type { ReactNode, ReactPortal, HTMLAttributes } from 'react';

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
};

const Dropdown = ({
  iconName,
  toggle,
  closeOnContentClick = false,
  className,
  contentClassName,
  componentClass: ComponentClass = 'button',
  triggerComponent,
  show,
  children,
  style,
  rootClose,
}: Props) => {
  const triggerRef = useRef(null);
  return (
    <ComponentClass
      onClick={show && !iconName ? undefined : toggle} // avoid double toggle because of rootClose
      ref={triggerRef}
      className={className}
      style={style}
    >
      {triggerComponent ||
        (iconName ? (
          <Icon name={iconName} onClick={show ? () => {} : toggle} />
        ) : null)}

      <Overlay
        show={show}
        onHide={toggle}
        target={triggerRef}
        placement="bottom"
        rootClose={rootClose ?? true}
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
  danger?: boolean;
} & HTMLAttributes<HTMLLIElement>;

const ListItem = ({ danger, ...props }: ListItemProps) => (
  <li className={cx(danger && styles.danger)} {...props} />
);

const Divider = () => <li className={styles.divider} />;

Dropdown.List = List;
Dropdown.ListItem = ListItem;
Dropdown.Divider = Divider;
export default Dropdown;
