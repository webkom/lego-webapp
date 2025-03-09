import cx from 'classnames';
import styles from './TextWithTitle.module.css';
import type { CSSProperties, ReactNode } from 'react';

type Props = {
  title: string;
  text: ReactNode;
  extraStyle?: CSSProperties;
  extraClassName?: string;
};

const TextWithBoldTitle = ({
  title,
  text,
  extraStyle,
  extraClassName,
}: Props) => {
  return (
    <div className={cx(styles.container, extraClassName)} style={extraStyle}>
      <h2 className={styles.boldTitle}>{title}</h2>
      <p>{text}</p>
    </div>
  );
};

const TextWithTitle = ({ title, text, extraStyle, extraClassName }: Props) => {
  return (
    <div className={cx(styles.container, extraClassName)} style={extraStyle}>
      <h3>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default TextWithBoldTitle;
export { TextWithTitle };
