import { useEffect, useState } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import styles from './Confetti.module.css';
import type { TConductorInstance } from 'react-canvas-confetti/dist/types';

const Confetti = () => {
  const [conductor, setConductor] = useState<TConductorInstance>();

  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor);
  };

  useEffect(() => {
    conductor?.run({ speed: 1.5, duration: 1500 });
  });

  return <Realistic className={styles.confetti} onInit={onInit} />;
};

export default Confetti;
