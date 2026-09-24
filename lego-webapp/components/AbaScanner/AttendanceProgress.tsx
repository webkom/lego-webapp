import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import ProgressBar from '~/components/ProgressBar';
import styles from './AttendanceProgress.module.css';

type Props = {
  presentCount: number;
  attendeeCount: number;
};

const AttendanceProgress = ({ presentCount, attendeeCount }: Props) => {
  const [pulse, setPulse] = useState(false);
  const previousCount = useRef(presentCount);

  useEffect(() => {
    const increased = presentCount > previousCount.current;
    previousCount.current = presentCount;
    if (!increased) {
      return;
    }
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 220);
    return () => clearTimeout(timeout);
  }, [presentCount]);

  const percent =
    attendeeCount > 0 ? Math.round((presentCount / attendeeCount) * 100) : 0;

  return (
    <Flex column gap="var(--spacing-sm)">
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Flex alignItems="baseline" gap="6px">
          <span className={cx(styles.count, pulse && styles.pulse)}>
            {presentCount}
          </span>
          <span className={styles.total}>/ {attendeeCount} møtt</span>
        </Flex>
        <div className={styles.summary}>
          <div className={styles.percent}>{percent} %</div>
          <div>{attendeeCount - presentCount} gjenstår</div>
        </div>
      </Flex>
      <ProgressBar value={presentCount} max={attendeeCount} label="Oppmøte" />
    </Flex>
  );
};

export default AttendanceProgress;
