import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { MoonStar, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { applySelectedTheme, getTheme, useTheme } from '~/utils/themeUtils';
import styles from './toggleTheme.module.css';
import type { ReactNode, MouseEvent } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
};

const ToggleTheme = ({ className, children, isButton = true }: Props) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className={cx(className, styles.toggleWrapper, {
        [styles.noTransition]: !mounted,
      })}
      onClick={handleThemeChange}
    >
      {children}
      <div className={styles.iconTrack} data-theme={theme}>
        <Icon iconNode={<Sun />} className={styles.icon} />
        <Icon iconNode={<MoonStar />} className={styles.icon} />
      </div>
    </Component>
  );
};

export default ToggleTheme;
