// @flow

import cx from 'classnames';
import styles from './Icon.css';

type Props = {
  /** Name of the icon can be found on the webpage linked down below */
  name: string,
  scaleOnHover?: boolean,
  className?: string,
  size?: number,
  /** Icon prefix. defaults to "ion-ios-" */
  prefix?: string,
  style?: Object,
};

/**
 * Render an Icon just like this:
 *
 * <Icon name="add" />
 *
 *
 * View the selection of icons here:
 *
 * https://infinitered.github.io/ionicons-version-3-search/
 */
function Icon({
  name = 'star',
  prefix = 'ion-ios-',
  scaleOnHover = false,
  className,
  style = {},
  size = 24,
  ...props
}: Props) {
  return (
    <i
      className={cx(`${prefix}${name}`, styles.icon, className)}
      style={{ fontSize: `${size.toString()}px`, lineHeight: 1, ...style }}
      {...(props: Object)}
    />
  );
}

Icon.Badge = ({ badgeCount, ...props }: Props & { badgeCount: number }) => {
  const icon = <Icon {...props} />;

  if (!badgeCount) {
    return icon;
  }

  return (
    <div style={{ position: 'relative' }}>
      <span className={styles.badge}>{badgeCount}</span>
      {icon}
    </div>
  );
};

Icon.Badge.displayName = 'IconBadge';

export default Icon;
