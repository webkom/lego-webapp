import React, { ReactNode } from 'react';

import NavigationLink from './NavigationLink';
import Icon from 'app/components/Icon';
import styles from './NavigationTab.css';
import cx from 'classnames';

interface Props {
  title?: ReactNode;
  back?: {
    label: string;
    path: string;
  };
  details?: ReactNode;
  headerClassName?: string;
  className?: string;
  headerClassName?: string;
  children?: ReactNode;
}

const NavigationTab = (props: Props) => {
  return (
    <div>
      {props.back && (
        <div>
          <NavigationLink to={props.back.path}>
            <Icon className={styles.backIcon} name="arrow-back" />
            <span className={styles.back}>{props.back.label}</span>
          </NavigationLink>
        </div>
      )}
      <div className={cx(styles.container, props.className)}>
        <h1 className={cx(styles.header, props.headerClassName)}>
          {props.title}
        </h1>
        <div className={styles.navigator}>{props.children}</div>
      </div>
      <div className={styles.details}>{props.details}</div>
    </div>
  );
};

export default NavigationTab;
export { NavigationLink };
