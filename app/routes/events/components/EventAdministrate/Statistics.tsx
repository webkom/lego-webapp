import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { fetchAllWithType } from 'app/actions/GroupActions';
import DatePicker from 'app/components/Form/DatePicker';
import { GroupType, type Dateish } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import styles from 'app/routes/events/components/EventAttendeeStatistics.css';
import { useAppDispatch } from 'app/store/hooks';

const Statistics = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchStatisticsGroups',
    () => dispatch(fetchAllWithType([GroupType.Committee, GroupType.Revue])),
    [],
  );

  const [viewStartTime, setViewStartTime] = useState<Dateish>(
    '2021-01-01T00:00:00.000Z',
  );
  const [viewEndTime, setViewEndTime] = useState<Dateish>(moment());

  const updateViewStartDate = (date: string) => {
    setViewStartTime(date);
  };

  const updateViewEndDate = (date: string) => {
    setViewEndTime(date);
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <label>Startdato for sidevisning</label>
        <DatePicker
          value={viewStartTime as string}
          onChange={updateViewStartDate}
          onBlur={() => {}}
          onFocus={() => {}}
        />
        <label>Sluttdato for sidevisning</label>
        <DatePicker
          value={viewEndTime as string}
          onChange={updateViewEndDate}
          onBlur={() => {}}
          onFocus={() => {}}
        />
      </div>

      <EventAttendeeStatistics
        viewStartTime={viewStartTime}
        viewEndTime={viewEndTime}
      />
    </>
  );
};

export default Statistics;
