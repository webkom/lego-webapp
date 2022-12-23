import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import Icon from 'app/components/Icon';
import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';
import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  back?: {
    label: string;
    path: string;
  };
  details?: ReactNode;
  headerClassName?: string;
  className?: string;
  children?: ReactNode;
};

const NavigationTab = (props: Props) => (
  <>
    {props.back && (
      <NavLink to={props.back.path} className={styles.back}>
        <Icon name="arrow-back" size={19} className={styles.backIcon} />
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
