import cx from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavigationLink.css';
import type { MouseEventHandler, ReactNode } from 'react';

type Props = {
  to: string;
  additionalActivePaths?: string[];
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children?: ReactNode;
};

/*
 * A NavLink wrapper which handles query params and multiple active paths.
 *
 * NOTICE: Preferably use the NavLink component from `react-router-dom` directly if possible.
 */
const NavigationLink = (props: Props) => {
  const location = useLocation();

  // Custom isActive function to handle query params and additional active paths
  const isActive = () => {
    const regex = /\/+$/i; // Regex to remove trailing / for comparison
    const currentPath = location.pathname + location.search;
    const normalizedCurrentPath = currentPath.replace(regex, '');

    if (normalizedCurrentPath === props.to.replace(regex, '')) {
      return true;
    }

    if (props.additionalActivePaths) {
      return props.additionalActivePaths.some(
        (additionalPath) =>
          additionalPath.replace(regex, '') === normalizedCurrentPath,
      );
    }

    return false;
  };

  return (
    <NavLink
      end
      to={props.to}
      onClick={props.onClick}
      className={cx(isActive() ? styles.active : '', styles.link)}
    >
      {props.children}
    </NavLink>
  );
};

export default NavigationLink;
