import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { ContentMain } from 'app/components/Content';
import { DatePicker } from 'app/components/Form';
import { GroupType, type Dateish } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import styles from 'app/routes/events/components/EventAttendeeStatistics.module.css';
import { useAppDispatch } from 'app/store/hooks';

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
