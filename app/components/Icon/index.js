// @flow

import styles from './Icon.css';

type Props = {
  /** Name of the icon can be found on the webpage*/
  name: string,
  scaleOnHover?: boolean,
  className?: string,
  size?: number,
  style?: Object,
};

/**
 * Render an Icon like this with the name of your icon:
 *
 * <Icon name="add" />
 *
 * Names can be found here:
 * https://ionic.io/ionicons
 *
 */
const Icon = ({
  name = 'star',
  scaleOnHover = false,
  className,
  style = {},
  size = 24,
  ...props
}: Props) => {
  return (
    <div
      className={className}
      style={{
        fontSize: `${size.toString()}px`,
        ...style,
      }}
      {...(props: Object)}
    >
      <ion-icon name={name}></ion-icon>
    </div>
  );
};

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
