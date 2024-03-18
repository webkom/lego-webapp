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

    if (diff < 0) {
      setTimeString("ER I GANG");
      return;
    }

    const withUnit = (value: number, unitSingular: string, unitPlural: string) => {
      return `${value} ${value == 1 ? unitSingular : unitPlural}`;
    }

    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

    const units = [
      withUnit(daysLeft, "dag", "dager"),
      withUnit(hoursLeft, "time", "timer"),
      withUnit(minutesLeft, "minutt", "minutter"),
      withUnit(secondsLeft, "sekund", "sekunder"),
    ]

    const timeLeft = units.slice(0, -1).join(", ") + " og " + units.slice(-1);
    setTimeString(`begynner om ${timeLeft}`);
  };
  return (
    <Banner
      header={"Påskeeggjakten til Webkom"}
      subHeader={timeString}
      link="https://abakus.no/articles/507"
      color="red"
    />
  );
};

export default CountDown;
