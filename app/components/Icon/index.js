// @flow

import cx from 'classnames';

import styles from './Icon.css';

type Props = {
  /** Name of the icon can be found on the webpage*/
  name: string,
  /** Name of the icon can be found on the webpage*/
  scaleOnHover?: boolean,
  /** Name of the icon can be found on the webpage*/
  className?: string,
  /** Name of the icon can be found on the webpage*/
  size?: number,
  /** Name of the icon can be found on the webpage*/
  prefix?: string,
  /** Icon prefix. defaults to "ion-ios-" */
  style?: Object,
};

/**
 * Render an Icon
 *
 * <Icon name="add" > </Icon>
 *
 * Just like this...
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
