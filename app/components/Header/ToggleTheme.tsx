import type { Node } from "react";
import { useCallback, useState } from "react";
import cx from "classnames";
import Icon from "../Icon";
import styles from "./toggleTheme.css";
import { applySelectedTheme, getTheme } from "app/utils/themeUtils";

const getIcon = () => getTheme() === 'dark' ? 'sunny' : 'moon';

type Props = {
  loggedIn: boolean;
  username?: string;
  updateUserTheme: (username: string, theme: string) => Promise<any>;
  className?: string;
  children?: Node;
  isButton?: boolean;
};

const ToggleTheme = ({
  loggedIn,
  username,
  updateUserTheme,
  className: classN,
  children,
  isButton = true
}: Props) => {
  const [icon, setIcon] = useState(getIcon());
  const handleThemeChange = useCallback(e => {
    e.preventDefault();
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applySelectedTheme(newTheme);
    setIcon(getIcon());
    loggedIn && username && updateUserTheme(username, newTheme);
  }, [loggedIn, username, updateUserTheme]);
  const className = cx(styles.toggleIcon, icon === 'moon' ? styles.moon : styles.sun);
  const props = {
    name: 'Endre tema',
    className: classN,
    onClick: handleThemeChange
  };
  return isButton ? <button {...props}>
      {children}
      <Icon name={icon} className={className} />
    </button> : <div {...props}>
      {children}
      <Icon name={icon} className={className} />
    </div>;
};

export default ToggleTheme;