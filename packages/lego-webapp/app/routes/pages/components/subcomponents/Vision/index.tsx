import cx from 'classnames';
import styles from './Vision.module.css';

type Props = {
  title: string;
  summary: string;
  paragraphs?: Array<string>;
  left?: boolean;
};

const Vision = ({ title, summary, paragraphs, left }: Props) => {
  return (
    <div>
      <h3 className={cx(styles.title, left && styles.titleLeft)}>{title}</h3>
      <p className={cx(styles.summary, left && styles.summaryLeft)}>
        {summary}
      </p>
      {paragraphs &&
        paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className={cx(styles.paragraph, left && styles.paragraphLeft)}
          >
            {paragraph}
          </p>
        ))}
    </div>
  );
};

export default Vision;
