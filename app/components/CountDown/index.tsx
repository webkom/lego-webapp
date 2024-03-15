import { useEffect, useState } from 'react';
import Banner from 'app/components/Banner';

const CountDown = () => {
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      findTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const findTime = () => {
    const now = new Date();
    const start = new Date('2024-03-20T12:00:00');
    const diff = start.getTime() - now.getTime();

    setTimeString(
      Math.floor(diff / (1000 * 60 * 60 * 24)) +
        ' dager ' +
        Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) +
        ' timer ' +
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) +
        ' minutter ' +
        Math.floor((diff % (1000 * 60)) / 1000) +
        ' sekunder',
    );
  };
  return (
    <Banner
      header={timeString}
      link="https://abakus.no/articles/507"
      color="red"
    />
  );
};

export default CountDown;
