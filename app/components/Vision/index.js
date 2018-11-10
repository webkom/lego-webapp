import React from 'react';
import styles from './Vision.css';
import cx from 'classnames';

const Vision = ({ title, summary, paragraphs, left }) => {
  return (
    <div>
      <h3
        className={cx(styles.vision__title, left && styles.vision__titleLeft)}
      >
        {title}
      </h3>
      <p
        className={cx(
          styles.vision__summary,
          left && styles.vision__summaryLeft
        )}
      >
        {summary}
      </p>
      {paragraphs &&
        paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className={cx(
              styles.vision__paragraph,
              left && styles.vision__paragraphLeft
            )}
          >
            {paragraph}
          </p>
        ))}
    </div>
  );
};

export default Vision;
