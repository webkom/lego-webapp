//@flow
import type { Node } from 'react';

import styles from './TextWithTitle.css';

type Props = {
  title: string,
  text: Node,
  extraStyle?: Object,
};

const TextWithBoldTitle = ({ title, text, extraStyle }: Props) => {
  return (
    <div className={styles.container} style={extraStyle}>
      <h2 className={styles.boldTitle}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

const TextWithTitle = ({ title, text, extraStyle }: Props) => {
  return (
    <div className={styles.container} style={extraStyle}>
      <h3 className={styles.title}>{title}</h3>
      <pre className={styles.textContainer}>
        <span className={styles.smallerText}>{text}</span>
      </pre>
    </div>
  );
};

export default TextWithBoldTitle;
export { TextWithTitle };
