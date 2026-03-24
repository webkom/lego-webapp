import { Flex, Icon, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Check, MoonStar, Sun, SunMoon } from 'lucide-react';
import { Field } from 'react-final-form';
import img from '~/assets/interest-group-logos/246e97d49e465e7d5ac7096c02318a9051ac7357c6a36031d5880c678958ea31.png';
import styles from './ThemeSelector.module.css';
import type { ReactNode } from 'react';

type ThemeOption = {
  icon: ReactNode;
  label: string;
  value: 'dark' | 'light' | 'auto';
};

const themeOptions: ThemeOption[] = [
  {
    icon: <SunMoon />,
    label: 'Auto',
    value: 'auto',
  },
  {
    icon: <Sun />,
    label: 'Lyst',
    value: 'light',
  },
  {
    icon: <MoonStar />,
    label: 'Mørkt',
    value: 'dark',
  },
];

const ThemeSelector = () => {
  return (
    <div>
      <label className={styles.label}>Fargetema</label>
      <Flex wrap gap="var(--spacing-md)" className={styles.themes}>
        {themeOptions.map((option) => (
          <Field
            name="selectedTheme"
            type="radio"
            value={option.value}
            key={option.value}
          >
            {({ input }) => (
              <div className={styles.optionWrapper}>
                <div
                  className={cx(styles.themeOption, styles[option.value])}
                  data-selected={input.checked}
                  onClick={() => input.onChange(option.value)}
                >
                  <div className={styles.previewBackground} />
                  <div className={styles.previewContent}>
                    <div className={styles.previewCard}>
                      <div className={styles.previewText}>Aa</div>
                    </div>
                  </div>
                  <Icon
                    iconNode={<Check />}
                    size={16}
                    className={styles.checkIcon}
                  />
                </div>
                <Flex alignItems="center" gap="var(--spacing-xs)">
                  <Icon iconNode={option.icon} size={16} />
                  <div className={styles.optionLabel}>{option.label}</div>
                </Flex>
              </div>
            )}
          </Field>
        ))}
        <Image src={img} alt="theme" className={styles.themeIcon} />
      </Flex>
    </div>
  );
};

export default ThemeSelector;
