import cx from 'classnames';
import { Button, Link } from 'react-aria-components';
import styles from './Tab.module.css';
import type { ReactNode } from 'react';
import type { PressEvent } from 'react-aria-components';

type Props = {
  active: boolean;
  disabled?: boolean;
  onPress?: (event: PressEvent) => void;
  href?: string;
  children: ReactNode;
};

export const Tab = ({ active, disabled, onPress, href, children }: Props) => {
  const className = cx(styles.tab, disabled && styles.disabled);

  return (
    <div className={styles.tabContainer} data-active={active}>
      {href ? (
        <Link
          href={href}
          isDisabled={disabled}
          onPress={onPress}
          className={className}
          data-test-id="tab"
        >
          {children}
        </Link>
      ) : (
        <Button
          isDisabled={disabled}
          onPress={onPress}
          className={className}
          data-test-id="tab"
        >
          {children}
        </Button>
      )}
    </div>
  );
};

export default Tab;
