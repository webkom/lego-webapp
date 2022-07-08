// @flow

import type { Node } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import Icon from 'app/components/Icon';
import NavigationLink from './NavigationLink';

import styles from './NavigationTab.css';

type Props = {
  title?: Node,
  back?: {
    label: string,
    path: string,
  },
  details?: Node,
  headerClassName?: string,
  className?: string,
  headerClassName?: string,
  children?: Node,
};

const NavigationTab = (props: Props) => (
  <>
    {props.back && (
      <NavLink to={props.back.path} className={styles.back}>
        <Icon
          size={19}
          name="arrow-back"
          prefix="ion-md-"
          className={styles.backIcon}
        />
        <span className={styles.backLabel}>{props.back.label}</span>
      </NavLink>
    )}
    <div className={cx(styles.container, props.className)}>
      <h1 className={cx(styles.header, props.headerClassName)}>
        {props.title}
      </h1>
      <div className={styles.navigator}>{props.children}</div>
    </div>
    <div className={styles.details}>{props.details}</div>
  </>
);

export default NavigationTab;
export { NavigationLink };
