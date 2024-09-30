import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './InfoBubble.module.css';
import type { HTMLAttributes, ReactNode } from 'react';

type Props = {
  /** Icon name */
  icon: string;

  /** Text under icon */
  data?: ReactNode;

  /** Small text below main text */
  meta?: string;

  /** Size of button */
  small?: boolean;

  /** Make link a clickable link - url */
  link?: string;

  /** Custom class name */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const httpCheck = (link) =>
  link.startsWith('http://') || link.startsWith('https://')
    ? link
    : `http://${link}`;

type IconComponentProps = {
  icon: string;
  bubbleClass: string;
  iconClass: string;
  link?: string;
};
const IconComponent = ({
  icon,
  bubbleClass,
  iconClass,
  link,
}: IconComponentProps) => {
  if (link) {
    return (
      <div className={bubbleClass}>
        <a href={httpCheck(link)} className={styles.iconLink}>
          <Icon name={icon} className={iconClass} size={30} />
        </a>
      </div>
    );
  }

  return (
    <div className={bubbleClass}>
      <Icon name={icon} className={iconClass} size={30} />
    </div>
  );
};

type DataComponentProps = {
  dataClass: string;
  data: ReactNode;
  link?: string;
};
const DataComponent = ({ dataClass, data, link }: DataComponentProps) => {
  if (link) {
    return (
      <a href={httpCheck(link)}>
        <span className={dataClass}>{data || '-'}</span>
      </a>
    );
  }

  return <span className={dataClass}>{data || '-'}</span>;
};

function InfoBubble({
  icon,
  data,
  meta,
  className,
  small = false,
  link,
  ...props
}: Props) {
  const bubbleClass = small ? styles.smallBubble : styles.bubble;
  const iconClass = small ? styles.smallIcon : styles.icon;
  const dataClass = small ? styles.smallData : styles.data;
  const metaClass = small ? styles.smallMeta : styles.meta;
  return (
    <div className={cx(styles.infoBubble, className)} {...props}>
      <IconComponent
        icon={icon}
        bubbleClass={bubbleClass}
        iconClass={iconClass}
        link={link}
      />
      <DataComponent dataClass={dataClass} data={data} link={link} />
      {meta && <DataComponent dataClass={metaClass} data={meta} />}
    </div>
  );
}

export default InfoBubble;
