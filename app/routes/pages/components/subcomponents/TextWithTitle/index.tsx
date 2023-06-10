import cx from 'classnames';
import styles from './TextWithTitle.module.css';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  text: ReactNode;
  extraStyle?: Record<string, any>;
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
      <p className={styles.text}>{text}</p>
    </div>
  );
};

const TextWithTitle = ({ title, text, extraStyle, extraClassName }: Props) => {
  return (
    <div className={cx(styles.container, extraClassName)} style={extraStyle}>
      <h3 className={styles.title}>{title}</h3>
      <pre className={styles.textContainer}>
        <span className={styles.smallerText}>{text}</span>
      </pre>
    </div>
  );
};

export default TextWithBoldTitle;
export { TextWithTitle };
