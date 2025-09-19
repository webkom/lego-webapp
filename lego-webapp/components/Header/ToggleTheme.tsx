import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Moon, Sun } from 'lucide-react';
import { type ReactNode, type MouseEvent, useState } from 'react';
import { applySelectedTheme, getTheme, useTheme } from '~/utils/themeUtils';
import styles from './toggleTheme.module.css';

const useIcon = () => (useTheme() === 'dark' ? <Sun /> : <Moon />);

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({ className, children, isButton = true }: Props) => {
  const icon = useIcon();
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);

  const handleThemeChange = (e: MouseEvent) => {
    e.preventDefault();
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applySelectedTheme(newTheme);

    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
  };

  const Component = isButton ? 'button' : 'div';
  return (
    <Component
      name="Endre tema"
      className={className}
      onClick={handleThemeChange}
    >
      {children}
      <div className={styles.iconWrapper}>
        <Icon
          iconNode={<Moon />}
          className={cx(
            styles.toggleIcon,
            theme === 'light' ? styles.enter : styles.exit,
          )}
          style={{ position: 'absolute' }}
        />
        <Icon
          iconNode={<Sun />}
          className={cx(
            styles.toggleIcon,
            theme === 'dark' ? styles.enter : styles.exit,
          )}
        />
      </div>
    </Component>
  );
};

export default ToggleTheme;
