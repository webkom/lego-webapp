import { useEffect, useState } from 'react';
import Banner from 'app/components/Banner';

const CountDown = () => {
  const [timeString, setTimeString] = useState('');
  const [timeStringHeader, setTimeStringHeader] = useState(
    'Påskeeggjakta til Webkom',
  );
  useEffect(() => {
    const interval = setInterval(() => {
      findTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const findTime = () => {
    const now = new Date();
    const start = new Date('2024-03-20T12:00:00');
    const slutt = new Date('2024-03-22T12:00:00');
    const started = start.getTime() - now.getTime() < 0;
    const diff = started
      ? slutt.getTime() - now.getTime()
      : start.getTime() - now.getTime();

    if (started) {
      setTimeStringHeader(timeStringHeader + ' ER I GONG');
    }

    const withUnit = (
      value: number,
      unitSingular: string,
      unitPlural: string,
    ) => {
      return `${value} ${value == 1 ? unitSingular : unitPlural}`;
    };

    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

    const units = [
      withUnit(daysLeft, 'dag', 'dagar'),
      withUnit(hoursLeft, 'time', 'timar'),
      withUnit(minutesLeft, 'minutt', 'minuttar'),
      withUnit(secondsLeft, 'sekund', 'sekundar'),
    ];

    const timeLeft = units.slice(0, -1).join(', ') + ' og ' + units.slice(-1);
    if (started) {
      setTimeString(`Jakta sluttar om ${timeLeft}`);
    } else {
      setTimeString(`byrjar om ${timeLeft}`);
    }
  };
  return (
    <Banner
      header={timeStringHeader}
      subHeader={timeString}
      link="https://abakus.no/articles/507"
      color="red"
    />
  );
};

export default CountDown;
