import cx from 'classnames';
import { useRef } from 'react';
import { Overlay } from 'react-overlays';
import Icon from 'app/components/Icon';
import styles from './Dropdown.css';
import type { Node, Portal } from 'react';

type Props = {
  iconName?: string;
  toggle: () => any;
  closeOnContentClick?: boolean;
  className?: string;
  contentClassName?: string;
  componentClass?: any;
  triggerComponent?: Node | Portal;
  show: boolean;
  children?: any;
  style?: any;
};

const Dropdown = ({
  iconName = 'star',
  toggle,
  closeOnContentClick = false,
  className,
  contentClassName,
  componentClass: ComponentClass = 'button',
  triggerComponent,
  show,
  children,
  style,
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
        placement="bottom"
        rootClose
        shouldUpdatePosition
      >
        {({ props, arrowProps }) => (
          <div
            {...props}
            className={cx(styles.content, contentClassName || null)}
            onClick={closeOnContentClick && toggle}
          >
            <div {...arrowProps} className={styles.arrow} />
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
