import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { GroupType, type Dateish } from 'app/models';
import { ContentMain } from '~/components/Content';
import { DatePicker } from '~/components/Form';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch } from '~/redux/hooks';
import EventAttendeeStatistics from './EventAttendeeStatistics';
import styles from './EventAttendeeStatistics.module.css';

const Statistics = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchStatisticsGroups',
    () => dispatch(fetchAllWithType([GroupType.Committee, GroupType.Revue])),
    [],
  );

  const [dateRange, setDateRange] = useState<[Dateish, Dateish]>([
    moment().subtract(1, 'month').toISOString(),
    moment().toISOString(),
  ]);

  const updateDateRange = (selectedDate: [Dateish, Dateish]) => {
    setDateRange(selectedDate);
  };

  return (
    <ContentMain>
      <div className={styles.filterContainer}>
        <label>Velg periode</label>
        <DatePicker
          range
          value={dateRange}
          onChange={updateDateRange}
          showTimePicker={false}
          onBlur={() => {}}
          onFocus={() => {}}
        />
      </div>

      <EventAttendeeStatistics
        viewStartTime={dateRange[0]}
        viewEndTime={dateRange[1]}
      />
    </ContentMain>
  );
};

export default Statistics;
