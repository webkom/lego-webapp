import { useEffect, useState } from 'react';
import Banner from 'app/components/Banner';

const CountDown = () => {
  const [timeString, setTimeString] = useState('');
  const [timeStringHeader, setTimeStringHeader] = useState(
    'Påskeeggjakta til Webkom',
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const slutt = new Date('2024-03-22T12:00:00');
      const innsendingSlutt = new Date('2024-03-22T23:59:59');

      const diff = slutt.getTime() - now.getTime();
      const isOver = diff < 0;
      const isInnsendingOver = innsendingSlutt.getTime() - now.getTime() < 0;

      setTimeStringHeader(
        isOver
          ? 'Påskeeggjakta til Webkom er over'
          : 'Påskeeggjakta til Webkom ER I GONG',
      );

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
      if (!isOver) {
        setTimeString(`Jakta sluttar om ${timeLeft}`);
      } else if (!isInnsendingOver) {
        setTimeString(`Send skjermbilda til webkom@abakus.no i løpet av dagen`);
      } else {
        setTimeString('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
