import { Flex } from '@webkom/lego-bricks';
import styles from './ChristmasCalendar.module.css';

type ChristmasCalendarType = {
  className: string;
};

const ChristmasCalendar = ({ className }: ChristmasCalendarType) => {
  const dates = Array.from({ length: 24 }, (_, i) => i + 1);
  const rows: Array<Array<number>> = [];
  const complete = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  for (let i = 0; i < dates.length; i += 4) {
    rows.push(dates.slice(i, i + 4));
  }

  return (
    <div className={className}>
      <Flex width={'100%'}>
        <AbakusPole />
        <div className={styles.abakusContainer}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.abakusRow}>
              <div className={styles.abakusBalls}>
                <Flex gap={(Math.random() * 0.7 + 2) * 10}>
                  {row.map((slot, slotIndex) =>
                    complete[4 * rowIndex + slotIndex] ? (
                      <AbakusBall key={slotIndex} date={slot} />
                    ) : null,
                  )}
                </Flex>
                <Flex
                  gap={(Math.random() * 0.9 + 0.2) * 10}
                  justifyContent="flex-end"
                >
                  {row.map((slot, slotIndex) =>
                    !complete[4 * rowIndex + slotIndex] ? (
                      <AbakusBall key={slotIndex} date={slot} />
                    ) : null,
                  )}
                </Flex>
              </div>
              <div className={styles.abakusWire} />
            </div>
          ))}
        </div>
        <AbakusPole />
      </Flex>
    </div>
  );
};

type AbakusBallType = {
  date: number;
};

const AbakusBall = ({ date }: AbakusBallType) => {
  return (
    <button
      className={
        date === new Date().getDate()
          ? `${styles.abakusBall} ${styles.ballShake}`
          : styles.abakusBall
      }
    >
      <p>{date}</p>
    </button>
  );
};

const AbakusPole = () => {
  return (
    <Flex column alignItems="center">
      <div className={styles.abakusPole} />
      <div className={styles.abakusBrick} />
    </Flex>
  );
};

export default ChristmasCalendar;
