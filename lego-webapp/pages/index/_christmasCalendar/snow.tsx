import styles from './snow.module.css';

export default function SnowBackground() {
  return (
    <div className={styles.container}>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={styles.snow}
          style={{
            left: `${Math.floor(Math.random() * 100)}%`,
            animationDuration: `${Math.floor(Math.random() * (21)) + 30}s`,
            animationDelay: `${Math.floor(Math.random() * 30) + 1}s`,
            opacity: `${Math.random()* (100 - 20) + 20}%`,
          }}
        />
      ))} 
    </div>
  );
}
