import React, { useState } from 'react';
import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Calendar.module.css';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
  lightBlue: styles.lightBlue,
  itdageneBlue: styles.itdageneBlue,
  buddyweek2024: styles.buddyweek2024,
};

type Props = {
  header: string;
  subHeader?: string;
  color?: keyof typeof COLORS;
  internal?: boolean; 
  className?: string;
};

const Calendar = ({
  header,
  subHeader,
  color,
  internal = false,
  className,
}: Props) => {
  const wiggleDates = [
    { date: "2024-11-06", link: "https://www.youtube.com" },
    { date: "2024-12-02", link: "/calendar/2024-12-02" },
    { date: "2024-12-03", link: "/calendar/2024-12-03" },
    { date: "2024-12-04", link: "/calendar/2024-12-04" },
    { date: "2024-12-05", link: "/calendar/2024-12-05" },
    { date: "2024-12-06", link: "/calendar/2024-12-06" },
    { date: "2024-12-07", link: "/calendar/2024-12-07" },
    { date: "2024-12-08", link: "/calendar/2024-12-08" },
    { date: "2024-12-09", link: "/calendar/2024-12-09" },
    { date: "2024-12-10", link: "/calendar/2024-12-10" },
    { date: "2024-12-11", link: "/calendar/2024-12-11" },
    { date: "2024-12-12", link: "/calendar/2024-12-12" },
    { date: "2024-12-13", link: "/calendar/2024-12-13" },
    { date: "2024-12-14", link: "/calendar/2024-12-14" },
    { date: "2024-12-15", link: "/calendar/2024-12-15" },
    { date: "2024-12-16", link: "/calendar/2024-12-16" },
    { date: "2024-12-17", link: "/calendar/2024-12-17" },
    { date: "2024-12-18", link: "/calendar/2024-12-18" },
    { date: "2024-12-19", link: "/calendar/2024-12-19" },
    { date: "2024-12-20", link: "/calendar/2024-12-20" },
    { date: "2024-12-21", link: "/calendar/2024-12-21" },
    { date: "2024-12-22", link: "/calendar/2024-12-22" },
    { date: "2024-12-23", link: "/calendar/2024-12-23" },
    { date: "2024-12-24", link: "/calendar/2024-12-24" }
  ];

  const today = new Date().toISOString().split('T')[0]; 

  const [wigglingBoxes, setWigglingBoxes] = useState(
    wiggleDates.map(item => item.date === today)
  );

  const handleBoxClick = index => {
    setWigglingBoxes(prevState =>
      prevState.map((isWiggling, i) => (i === index ? false : isWiggling))
    );
  };

  return (
    <div className={cx(styles.Calendar, className, color && COLORS[color])}>
      <Card className={styles.mainCard}>
        <h1>{header}</h1>
        <div className={styles.boxContainer}>
          {wiggleDates.map((item, index) => {
            const boxNumber = index + 1;
            const isWiggling = wigglingBoxes[index];
            const isAvailable = today >= item.date; 

            return (
              <div
                key={index}
                className={cx(styles.box, {
                  [styles.wiggle]: isWiggling,
                  [styles.disabled]: !isAvailable,
                })}
                onClick={() => isAvailable && handleBoxClick(index)} 
              >
                {isAvailable ? (
                  <Link to={item.link} className={styles.activeLink}>
                    {boxNumber}
                  </Link>
                ) : (
                  <span className={styles.inactiveLink}>{boxNumber}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      {subHeader && <h2>{subHeader}</h2>}
    </div>
  );
};

export default Calendar;