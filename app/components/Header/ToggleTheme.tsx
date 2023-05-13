import cx from 'classnames';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { applySelectedTheme, getTheme, useTheme } from 'app/utils/themeUtils';
import Icon from '../Icon';
import styles from './toggleTheme.css';
import type { ReactNode } from 'react';

const useIcon = () => (useTheme() === 'dark' ? 'sunny' : 'moon');

type Props = {
  loggedIn: boolean;
  username?: string;
  updateUserTheme: (username: string, theme: string) => Promise<any>;
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({
  loggedIn,
  username,
  updateUserTheme,
  className: classN,
  children,
  isButton = true,
}: Props) => {
  const icon = useIcon();

  const handleThemeChange = useCallback(
    (e) => {
      e.preventDefault();
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applySelectedTheme(newTheme);
      loggedIn && username && updateUserTheme(username, newTheme);
    },
    [loggedIn, username, updateUserTheme]
  );
  const className = cx(
    styles.toggleIcon,
    icon === 'moon' ? styles.moon : styles.sun
  );
  const props = {
    name: 'Endre tema',
    className: classN,
    onClick: debounce(handleThemeChange, 200),
  };
  return isButton ? (
    <button {...props}>
      {children}
      <Icon name={icon} className={className} />
    </button>
  ) : (
    <div {...props}>
      {children}
      <Icon name={icon} className={className} />
    </div>
  );
};

export default ToggleTheme;
