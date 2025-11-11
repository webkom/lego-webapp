import styles from './snow.module.css';

export default function SnowBackground() {
  return (
    <div className={styles.container}>
      {Array.from({ length: 50 }).map((_, i) => { 
        var random_size = Math.floor(Math.random() * 9) + 4;
        return (
        <div
          key={i}
          className={styles.snow}
          style={{
            left: `${Math.floor(Math.random() * 100)}%`,
            width: `${random_size}px`,
            height: `${random_size}px`,
            animationDuration: `${Math.floor(Math.random() * (21)) + 30}s`,
            animationDelay: `${Math.floor(Math.random() * 30) + 1}s`,
            opacity: Math.random() * 0.8 + 0.2,
          }}
        />
      )})}
    </div>
  );
}
