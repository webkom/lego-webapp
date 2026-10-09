import cx from 'classnames';
import { useRef } from 'react';
import { Overlay } from 'react-overlays';
import { Icon } from '../Icon';
import styles from './Dropdown.module.css';
import type {
  ElementType,
  ReactNode,
  ReactPortal,
  HTMLAttributes,
  RefObject,
} from 'react';
import type { DOMContainer } from 'react-overlays/useWaitForDOMRef';

type Props = {
  iconNode?: ReactNode;
  toggle: () => void;
  closeOnContentClick?: boolean;
  className?: string;
  contentClassName?: string;
  componentClass?: ElementType;
  triggerComponent?: ReactNode | ReactPortal;
  show: boolean;
  children?: ReactNode;
  style?: Record<string, string>;
  rootClose?: boolean;
  container?: DOMContainer;
};

export const Dropdown = ({
  iconNode,
  toggle,
  closeOnContentClick = false,
  className,
  contentClassName,
  componentClass: ComponentClass = iconNode ? 'div' : 'button',
  triggerComponent,
  show,
  children,
  style,
  rootClose,
  container,
}: Props) => {
  const triggerRef = useRef<HTMLElement>(null) as RefObject<HTMLElement>;

  return (
    <ComponentClass
      onClick={show && !iconNode ? undefined : toggle} // avoid double toggle because of rootClose
      ref={triggerRef}
      className={cx(styles.trigger, className)}
      style={style}
      data-test-id="dropdown"
    >
      {triggerComponent ||
        (iconNode ? (
          <Icon iconNode={iconNode} onPress={show ? () => {} : toggle} />
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
            role="presentation"
            data-test-id="dropdown-content"
            className={cx(styles.content, contentClassName || null)}
            onClick={closeOnContentClick ? toggle : undefined}
          >
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
Dropdown.itemClassName = styles.dropdownItem;
