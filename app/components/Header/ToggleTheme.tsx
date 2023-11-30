import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { updateUserTheme } from 'app/actions/UserActions';
import { selectCurrentUser, selectIsLoggedIn } from 'app/reducers/auth';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { applySelectedTheme, getTheme, useTheme } from 'app/utils/themeUtils';
import styles from './toggleTheme.css';
import type { ReactNode, MouseEvent } from 'react';

const useIcon = () => (useTheme() === 'dark' ? 'sunny' : 'moon');

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({ className, children, isButton = true }: Props) => {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const username = useAppSelector(selectCurrentUser)?.username;
  const icon = useIcon();

  const handleThemeChange = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applySelectedTheme(newTheme);
      loggedIn && username && dispatch(updateUserTheme(username, newTheme));
    },
    [loggedIn, username, dispatch]
  );

  const Component = isButton ? 'button' : 'div';
  return (
    <Component
      name="Endre tema"
      className={className}
      onClick={debounce(handleThemeChange, 200)}
    >
      {children}
      <Icon
        name={icon}
        className={cx(
          styles.toggleIcon,
          icon === 'moon' ? styles.moon : styles.sun
        )}
      />
    </Component>
  );
};

export default ToggleTheme;
