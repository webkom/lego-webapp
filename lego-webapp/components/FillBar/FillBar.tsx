import styles from './FillBar.module.css';

type FillBarProps = {
  cur: number;
  cap: number;
};

const FillBar = ({ cur, cap }: FillBarProps) => {
  const width = cap > 0 ? Math.min((cur / cap) * 100, 100) : 0;

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: `${width}%` }} />
    </div>
  );
};

export default FillBar;
