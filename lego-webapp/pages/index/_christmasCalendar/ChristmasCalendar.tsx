import { Flex, Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import React from 'react';
import { fetchUser } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './ChristmasCalendar.module.css';
import ArcadeGameBox from './_arcadeGame/ArcadeGameCanvas';

type ChristmasCalendarType = {
  className: string;
};

const ChristmasCalendar = ({ className }: ChristmasCalendarType) => {
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchChristmasSlots',
    () => {
      if (currentUser) {
        dispatch(fetchUser(currentUser.username));
      }
    },
    [currentUser?.username],
  );

  const content = React.useMemo(
    () => [
      <p key={1}><ArcadeGameBox dateNr={1} /></p>,
      <p key={2}>test</p>,
      <p key={3}>test</p>,
      <p key={4}>test</p>,
      <p key={5}>test</p>,
      <p key={6}>test</p>,
      <p key={7}>test</p>,
      <p key={8}><ArcadeGameBox dateNr={8} /></p>,
      <p key={9}>test</p>,
      <p key={10}>test</p>,
      <p key={11}><ArcadeGameBox dateNr={11} /></p>,
      <p key={12}>test</p>,
      <p key={13}>test</p>,
      <p key={14}>test</p>,
      <p key={15}><ArcadeGameBox dateNr={15} /></p>,
      <p key={16}>test</p>,
      <p key={17}>test</p>,
      <p key={18}>test</p>,
      <p key={19}>test</p>,
      <p key={20}><ArcadeGameBox dateNr={20} /></p>,
      <p key={21}>test</p>,
      <p key={22}>test</p>,
      <p key={23}>test</p>,
      <p key={24}>test</p>,
    ],
  []
  );

  const rows = React.useMemo(() => {
    const r: React.ReactElement[][] = [];
    for (let i = 0; i < content.length; i += 4) {
      r.push(content.slice(i, i + 4));
    }
    return r;
  }, [content]);

  const gapMatrix = React.useMemo(
    () =>
      Array.from({ length: rows.length }, () => ({
        left: (Math.random() * 0.9 + 0.2) * 10,
        right: (Math.random() * 0.9 + 0.2) * 10,
      })),
    [rows.length]
  );

  if (!currentUser) return null;

  const christmasSlots = currentUser.christmasSlots.map(
    (slot) => slot.slot.slot,
  );

  const complete = Array.from({ length: 24 }, (_, i) =>
    christmasSlots.includes(i + 1),
  );

  return (
    <div className={className}>
      <Flex width="100%">
        <AbakusPole />
        <div className={styles.abakusContainer}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.abakusRow}>
              <div className={styles.abakusBalls}>
                <Flex gap={gapMatrix[rowIndex].left}>
                  {row.map((content, index) =>
                    complete[4 * rowIndex + index] ? (
                      <AbakusBall
                        key={index}
                        date={4 * rowIndex + index + 1}
                        content={content}
                        complete={complete}
                      />
                    ) : null
                  )}
                </Flex>

                <Flex
                  gap={gapMatrix[rowIndex].right}
                  justifyContent="flex-end"
                >
                  {row.map((content, index) =>
                    !complete[4 * rowIndex + index] ? (
                      <AbakusBall
                        key={index}
                        date={4 * rowIndex + index + 1}
                        content={content}
                        complete={complete}
                      />
                    ) : null
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
  content: React.ReactElement;
  complete: Array<boolean>;
};

const AbakusBall = ({ date, content, complete }: AbakusBallType) => {
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().getDate();

  return (
    <>
      <button
        className={
          Number(date) === currentDate
            ? `${styles.abakusBall} ${styles.ballShake}`
            : styles.abakusBall
        }
        onClick={() =>
          currentDate >= Number(date) && !complete[date - 1]
            ? setOpen(true)
            : false
        }
      >
        <p>{date}</p>
      </button>
      <Modal
        contentClassName={styles.slotModal}
        isOpen={open}
        onOpenChange={setOpen}
        title={`Luke ${date}`}
      >
        {content}
      </Modal>
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
