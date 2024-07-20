import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { debounce } from 'lodash';
import { MoonStar, Sun } from 'lucide-react';
import { useCallback } from 'react';
import { updateUserTheme } from 'app/actions/UserActions';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { useAppDispatch } from 'app/store/hooks';
import { applySelectedTheme, getTheme, useTheme } from 'app/utils/themeUtils';
import styles from './toggleTheme.css';
import type { ReactNode, MouseEvent } from 'react';

const useIcon = () => (useTheme() === 'dark' ? <Sun /> : <MoonStar />);

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({ className, children, isButton = true }: Props) => {
  const dispatch = useAppDispatch();
  const loggedIn = useIsLoggedIn();
  const username = useCurrentUser()?.username;
  const icon = useIcon();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateUserTheme = useCallback(
    debounce((username, newTheme) => {
      dispatch(updateUserTheme(username, newTheme));
    }, 2000),
    [dispatch],
  );

  const handleThemeChange = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applySelectedTheme(newTheme);
      loggedIn && username && debouncedUpdateUserTheme(username, newTheme);
    },
    [loggedIn, username, debouncedUpdateUserTheme],
  );

  const Component = isButton ? 'button' : 'div';
  return (
    <Component
      name="Endre tema"
      className={className}
      onClick={handleThemeChange}
    >
      {children}
      <Icon
        iconNode={icon}
        className={cx(
          styles.toggleIcon,
          useTheme() === 'light' ? styles.moon : styles.sun,
        )}
      />
    </Component>
  );
};

export default ToggleTheme;
