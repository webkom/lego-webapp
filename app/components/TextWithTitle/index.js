import React from 'react';
import styles from './TextWithTitle.css';
import cx from 'classnames';

const TextWithRedTitle = ({ title, text, extraStyle }) => {
  return (
    <div className={styles.container} style={extraStyle}>
      <h2 className={styles.redTitle}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

const TextWithTitle = ({ title, text, extraStyle }) => {
  return (
    <div className={styles.container} style={extraStyle}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.textContainer}>
        <pre className={styles.smallerText}>{text}</pre>
      </p>
    </div>
  );
};

export default TextWithRedTitle;
export { TextWithTitle };
