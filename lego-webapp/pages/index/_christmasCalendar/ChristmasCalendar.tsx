import { Flex, Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import React, { useRef } from 'react';
import { fetchUser } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './ChristmasCalendar.module.css';
import ContentInput from './ContentInput/ContentInput';
import FindTheLogo from './FindTheLogo/FindTheLogo';
import QuizGame from './QuizGame/QuizGame';
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
    [],
  );

  const content = React.useMemo(
    () => [
      <ArcadeGameBox dateNr={1} key={1} />,
      <p key={2}>test</p>,
      <QuizGame key={3} date={3} />,
      <FindTheLogo key={4} date={4} />,
      <ContentInput key={5} day={5} />,
      <QuizGame key={6} date={6} />,
      <p key={7}>test</p>,
      <ArcadeGameBox dateNr={8} key={8} />,
      <FindTheLogo key={9} date={9} />,
      <ContentInput key={10} day={10} />,
      <ArcadeGameBox dateNr={11} key={11} />,
      <ContentInput key={12} day={12} />,
      <QuizGame key={13} date={13} />,
      <FindTheLogo key={14} date={14} />,
      <ArcadeGameBox dateNr={15} key={15} />,
      <p key={16}>test</p>,
      <QuizGame key={17} date={17} />,
      <FindTheLogo key={18} date={18} />,
      <ContentInput key={19} day={19} />,
      <ArcadeGameBox dateNr={20} key={20} />,
      <QuizGame key={21} date={21} />,
      <ContentInput key={22} day={22} />,
      <FindTheLogo key={23} date={23} />,
      <p key={24}>test</p>,
    ],
    [],
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
    [rows.length],
  );

  if (!currentUser) return null;

  const complete = Array.from({ length: 24 }, (_, i) =>
    currentUser.christmasSlots.includes(i + 1),
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
                    ) : null,
                  )}
                </Flex>

                <Flex gap={gapMatrix[rowIndex].right} justifyContent="flex-end">
                  {row.map((content, index) =>
                    !complete[4 * rowIndex + index] ? (
                      <AbakusBall
                        key={index}
                        date={4 * rowIndex + index + 1}
                        content={content}
                        complete={complete}
                      />
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
  content: React.ReactElement;
  complete: Array<boolean>;
};

const AbakusBall = ({ date, content, complete }: AbakusBallType) => {
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().getDate();

  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  const firstRender = useRef(true);

  usePreparedEffect(
    'fetchChristmasSlots',
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      dispatch(fetchUser(currentUser?.username));
    },
    [open],
  );

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
        contentClassName={styles.window}
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
