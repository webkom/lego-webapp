import cx from 'classnames';
import { NavLink } from 'react-router-dom-v5-compat';
import styles from './NavigationLink.css';
import type { ReactNode } from 'react';

type Props = {
  to: string;
  onClick?: (e: Event) => void;
  children?: ReactNode;
};

const NavigationLink = (props: Props) => {
  // Custom isActive function as NavLink does not compare query params by default
  const isActive = (match, location) => {
    const regex = /\/+$/i; // Regex to remove trailing / for comparison

    const comparePath = location.pathname + location.search;
    return props.to.replace(regex, '') === comparePath.replace(regex, '');
  };

  return (
    <NavLink
      end
      isActive={isActive}
      to={props.to}
      onClick={props.onClick}
      className={({ isActive }) =>
        cx(isActive ? styles.active : '', styles.link)
      }
    >
      {props.children}
    </NavLink>
  );
};

export default NavigationLink;
