import moment from 'moment-timezone';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Select from 'react-select';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PieChartWithLabel from 'app/components/Chart/PieChartWithLabel';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import { CHART_COLORS } from 'app/components/Chart/utils';
import { Content } from 'app/components/Content';
import { selectStyles, selectTheme } from 'app/components/Form/SelectInput';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Dateish, Event, Group } from 'app/models';
import { COLOR_CONSTANTS, EVENT_CONSTANTS } from 'app/routes/events/utils';
import styles from './Statistics.css';

interface Props {
  committees: Group[];
  revueGroups: Group[];
  previousEvents: Event[];
  onSelect: (year: string, semester: string) => void;
}

interface WeekNumberDistribution {
  weekNumber: string;
}

interface EventTypeDistribution {
  eventType: string;
  count: number;
  paidCount: number;
  capacity: number;
  registrationCount: number;
}

interface StatisticsDistributions {
  eventTypeDistribution: EventTypeDistribution[];
  weekNumberDistribution: WeekNumberDistribution[];
}

interface EventTypeDistributions {
  capacityDistribution: DistributionDataPoint[];
  paidDistribution: DistributionDataPoint[];
}

const SEMESTER_OPTIONS = [
  { label: 'hele året', value: 'year' },
  { label: 'vår', value: 'spring' },
  { label: 'høst', value: 'autumn' },
];

const EVENT_TYPE_OPTIONS = Object.keys(EVENT_CONSTANTS).map((type) => ({
  label: EVENT_CONSTANTS[type],
  value: type,
}));

const PAST_FIVE_YEARS_OPTIONS = [...Array(5)].map((_, yearOffset) => {
  const year = moment().year() - yearOffset;
  return { value: year, label: String(year) };
});

const addEventWeekDataPoint = (
  weekNumberDistribution: WeekNumberDistribution[],
  startTime: Dateish,
  eventType: string
) => {
  const weekNumber = `Uke ${moment(startTime).week()}`;
  const existingWeekEntry = weekNumberDistribution.find(
    (entry) => entry.weekNumber === weekNumber
  );

  if (existingWeekEntry) {
    existingWeekEntry[eventType] =
      eventType in existingWeekEntry ? existingWeekEntry[eventType] + 1 : 1;
  } else {
    weekNumberDistribution.push({
      weekNumber,
      [eventType]: 1,
    });
  }
};

const addEventTypeDataPoint = (
  eventTypeDistribution: EventTypeDistribution[],
  event: Event
) => {
  const existingEventTypeEntry = eventTypeDistribution.find(
    (entry) => entry.eventType === event.eventType
  );

  // Some events have more registrations than its capacity
  const registrationCount = Math.min(
    event.registrationCount,
    event.totalCapacity
  );

  if (existingEventTypeEntry) {
    existingEventTypeEntry.count++;
    existingEventTypeEntry.paidCount += event.isPriced ? 1 : 0;
    existingEventTypeEntry.capacity += event.totalCapacity;
    existingEventTypeEntry.registrationCount += registrationCount;
  } else {
    eventTypeDistribution.push({
      eventType: event.eventType,
      count: 1,
      paidCount: event.isPriced ? 1 : 0,
      capacity: event.totalCapacity,
      registrationCount: registrationCount,
    });
  }
};

const createEventDataPoints = (events: Event[]) => {
  const eventStatistics: StatisticsDistributions = {
    eventTypeDistribution: [],
    weekNumberDistribution: [],
  };

  for (const event of events) {
    addEventWeekDataPoint(
      eventStatistics.weekNumberDistribution,
      event.startTime,
      EVENT_CONSTANTS[event.eventType]
    );

    addEventTypeDataPoint(eventStatistics.eventTypeDistribution, event);
  }

  return eventStatistics;
};

const Statistics = (props: Props) => {
  const { year, semester } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });

  const { eventTypeDistribution, weekNumberDistribution } =
    createEventDataPoints(props.previousEvents);

  const [selectedEventType, setSelectedEventType] = useState(
    EVENT_TYPE_OPTIONS[0]
  );
  const [eventTypeStatistics, setEventTypeStatistics] =
    useState<EventTypeDistributions>();

  useEffect(() => {
    const selectEventTypeDataPoints = (
      selectedEventType: string
    ): EventTypeDistributions => {
      const selectedDataPoint = eventTypeDistribution.find(
        (eventTypeDataPoint) =>
          eventTypeDataPoint.eventType === selectedEventType
      );

      if (!selectedDataPoint)
        return {
          capacityDistribution: [],
          paidDistribution: [],
        };

      return {
        capacityDistribution: [
          {
            name: 'Ledige plasser',
            count:
              selectedDataPoint.capacity - selectedDataPoint.registrationCount,
          },
          {
            name: 'Fylte plasser',
            count: selectedDataPoint.registrationCount,
          },
        ],
        paidDistribution: [
          {
            name: 'Betalt arrangement',
            count: selectedDataPoint.paidCount,
          },
          {
            name: 'Gratis-arrangement',
            count: selectedDataPoint.count - selectedDataPoint.paidCount,
          },
        ],
      };
    };

    if (eventTypeDistribution.length === 0) return;

    setEventTypeStatistics(selectEventTypeDataPoints(selectedEventType.value));
  }, [eventTypeDistribution.length, selectedEventType]);

  if (eventTypeDistribution.length === 0 || !eventTypeStatistics) {
    return (
      <Content>
        <Helmet title="Statistikk" />
        <h1>Statistikk</h1>
        <LoadingIndicator loading={true} />
      </Content>
    );
  }

  return (
    <Content>
      <Helmet title="Statistikk" />
      <h1>Statistikk</h1>
      <Flex wrap gap="0.4rem" className={styles.selectPeriodContainer}>
        <Select
          name="select-year"
          value={
            PAST_FIVE_YEARS_OPTIONS.find(
              (pastYearOption) => pastYearOption.value === Number(year)
            ) ?? PAST_FIVE_YEARS_OPTIONS[0]
          }
          options={PAST_FIVE_YEARS_OPTIONS}
          onChange={(selectedYear) => {
            props.onSelect(String(selectedYear.value), String(semester));
          }}
          isClearable={false}
          theme={selectTheme}
          styles={selectStyles}
          className={styles.selectPeriod}
        />

        <Select
          name="select-semester"
          value={
            SEMESTER_OPTIONS.find(
              (semesterOption) => semesterOption.value === semester
            ) ?? SEMESTER_OPTIONS[0]
          }
          options={SEMESTER_OPTIONS}
          onChange={(selectedSemester) => {
            props.onSelect(String(year), selectedSemester.value);
          }}
          isClearable={false}
          theme={selectTheme}
          styles={selectStyles}
          className={styles.selectPeriod}
        />
      </Flex>

      <PieChartWithLabel
        label={'Arrangementstyper'}
        distributionData={eventTypeDistribution.map((eventTypeDataPoint) => ({
          name: EVENT_CONSTANTS[eventTypeDataPoint.eventType],
          count: eventTypeDataPoint.count,
        }))}
        displayCount={true}
        namedChartColors={Object.keys(COLOR_CONSTANTS).reduce(
          (acc, colorConstantKey) => ({
            ...acc,
            [EVENT_CONSTANTS[colorConstantKey]]:
              COLOR_CONSTANTS[colorConstantKey],
          }),
          {}
        )}
      />

      <h4>Arrangementstyper per uke</h4>
      <BarChart
        width={1000}
        height={400}
        data={weekNumberDistribution}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weekNumber" />
        <YAxis />
        <Tooltip />
        <Legend />
        {eventTypeDistribution.map((dataPoint, index) => (
          <Bar
            key={EVENT_CONSTANTS[dataPoint.eventType]}
            dataKey={EVENT_CONSTANTS[dataPoint.eventType]}
            stackId="a"
            fill={COLOR_CONSTANTS[dataPoint.eventType]}
          />
        ))}
      </BarChart>

      <h3>Arrangementstype</h3>
      <Select
        name="select-event-type"
        value={selectedEventType}
        options={EVENT_TYPE_OPTIONS}
        onChange={(selectedEventType) => {
          setSelectedEventType(selectedEventType);
        }}
        isClearable={false}
        theme={selectTheme}
        styles={selectStyles}
        className={styles.selectEventType}
      />

      <PieChartWithLabel
        label={'Fyllgrad'}
        distributionData={eventTypeStatistics.capacityDistribution}
        displayCount={true}
      />
      <PieChartWithLabel
        label={'Betalte arrangementer'}
        distributionData={eventTypeStatistics.paidDistribution}
        displayCount={true}
      />
    </Content>
  );
};

export default Statistics;
