import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Divide, MoonStar, Sun } from 'lucide-react';
import { applySelectedTheme, getTheme, useTheme } from '~/utils/themeUtils';
import styles from './toggleTheme.module.css';
import type { ReactNode, MouseEvent } from 'react';
import { differenceBy } from 'lodash-es';

const useIcon = () => (useTheme() === 'dark' ? <Sun /> : <MoonStar />);

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({ className, children, isButton = true }: Props) => {
  const icon = useIcon();

  const handleThemeChange = (e: MouseEvent) => {
    e.preventDefault();
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applySelectedTheme(newTheme);
  };

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
