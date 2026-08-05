import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { MoonStar, Sun } from 'lucide-react';
import { useAppDispatch } from '~/redux/hooks';
import { applySelectedTheme, useTheme } from '~/utils/themeUtils';
import styles from './toggleTheme.module.css';
import type { ReactNode, MouseEvent } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
  isButton?: boolean;
  variant?: 'navbar' | 'header';
};

const ToggleTheme = ({
  className,
  children,
  isButton = true,
  variant = 'navbar',
}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleThemeChange = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(applySelectedTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const Component = isButton ? 'button' : 'div';

  return (
    <Component
      name="Endre tema"
      className={cx(className, styles.toggleWrapper, styles[variant])}
      onClick={handleThemeChange}
    >
      {children}
      <div className={styles.iconTrack}>
        <Icon iconNode={<Sun />} className={styles.icon} />
        <Icon iconNode={<MoonStar />} className={styles.icon} />
      </div>
    </Component>
  );
};

export default ToggleTheme;
