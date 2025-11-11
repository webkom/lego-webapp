import React, { useMemo } from 'react';
import styles from './snow.module.css';

export default function SnowBackground() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 50 }).map(() => {
        const left = `${Math.floor(Math.random() * 100)}%`;
        const fallDuration = `${Math.floor(Math.random() * 21) + 30}s`;
        const fallDelay = `${Math.floor(Math.random() * 30)}s`;
        const size = `${Math.floor(Math.random() * 9) + 4}px`;
        const swayDuration = `${Math.floor(Math.random() * 3) + 3}s`;
        const amplitude = `${Math.floor(Math.random() * 4) + 2}px`;
        const opacity = Math.random() * 0.6 + 0.4;
        return {
          left,
          fallDuration,
          fallDelay,
          size,
          swayDuration,
          amplitude,
          opacity,
        };
      }),
    [],
  );

  return (
    <div className={styles.container}>
      {flakes.map((f, i) => (
        <div
          key={i}
          className={styles.snowWrapper}
          style={{
            left: f.left,
            animationDuration: f.fallDuration,
            animationDelay: f.fallDelay,
          }}
        >
          <div
            className={styles.snow}
            style={
              {
                width: f.size,
                height: f.size,
                animationDuration: f.swayDuration,
                opacity: f.opacity,
                ['--amplitude' as any]: f.amplitude,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}
