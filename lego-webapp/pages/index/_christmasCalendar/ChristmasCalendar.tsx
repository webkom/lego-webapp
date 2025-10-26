import { DialogTrigger, Flex, Modal } from '@webkom/lego-bricks';
import React from 'react';
import styles from './ChristmasCalendar.module.css';

type ChristmasCalendarType = {
  className: string;
};

const ChristmasCalendar = ({ className }: ChristmasCalendarType) => {
  const content = [
    <p key={1}>test</p>,
    <p key={2}>test</p>,
    <p key={3}>test</p>,
    <p key={4}>test</p>,
    <p key={5}>test</p>,
    <p key={6}>test</p>,
    <p key={7}>test</p>,
    <p key={8}>test</p>,
    <p key={9}>test</p>,
    <p key={10}>test</p>,
    <p key={11}>test</p>,
    <p key={12}>test</p>,
    <p key={13}>test</p>,
    <p key={14}>test</p>,
    <p key={15}>test</p>,
    <p key={16}>test</p>,
    <p key={17}>test</p>,
    <p key={18}>test</p>,
    <p key={19}>test</p>,
    <p key={20}>test</p>,
    <p key={21}>test</p>,
    <p key={22}>test</p>,
    <p key={23}>test</p>,
    <p key={24}>test</p>,
  ];
  const rows: Array<Array<React.ReactElement>> = [];
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

  for (let i = 0; i < content.length; i += 4) {
    rows.push(content.slice(i, i + 4));
  }

  return (
    <div className={className}>
      <Flex width={'100%'}>
        <AbakusPole />
        <div className={styles.abakusContainer}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.abakusRow}>
              <div className={styles.abakusBalls}>
                <Flex gap={(Math.random() * 0.9 + 0.2) * 10}>
                  {row.map((content, index) =>
                    complete[4 * rowIndex + index] ? (
                      <AbakusBall key={index} date={4 * rowIndex + index + 1} content={content} complete={complete}/>
                    ) : null,
                  )}
                </Flex>
                <Flex
                  gap={(Math.random() * 0.9 + 0.2) * 10}
                  justifyContent="flex-end"
                >
                  {row.map((content, index) =>
                    !complete[4 * rowIndex + index] ? (
                      <AbakusBall key={index} date={4 * rowIndex + index + 1} content={content} complete={complete} />
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
  content: React.ReactElement
  complete: Array<boolean>
};

const AbakusBall = ({ date, content, complete }: AbakusBallType) => {
  const [open, setOpen] = React.useState(false)
  const TEST_DATE = 10

  return (
    <>
    <button
      className={
        Number(date) === TEST_DATE
          ? `${styles.abakusBall} ${styles.ballShake}`
          : styles.abakusBall
      }
      onClick={() => TEST_DATE >= Number(date) && !complete[date-1] ? setOpen(true) : false }
    >
      <p>{date}</p>
    </button>
    <Modal isOpen={open} onOpenChange={setOpen} title={`Luke ${date}`}>{content}</Modal>
    </>
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
