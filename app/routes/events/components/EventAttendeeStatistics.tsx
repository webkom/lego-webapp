import { Card, Flex } from '@webkom/lego-bricks';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchAnalytics } from 'app/actions/EventActions';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import type { Dateish } from 'app/models';
import { useAppDispatch } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type { DetailedRegistration } from 'app/store/models/Registration';
import styles from './EventAttendeeStatistics.css';

interface RegistrationDateDataPoint {
  name: string;
  fullDate: Dateish;
  registrations: number;
  unregistrations: number;
}

interface AttendeeStatistics {
  genderDistribution: DistributionDataPoint[];
  groupDistribution: DistributionDataPoint[];
  dataTekDistribution: DistributionDataPoint[];
  komTekDistribution: DistributionDataPoint[];
  totalDistribution: DistributionDataPoint[];
  registrationTimeDistribution: RegistrationDateDataPoint[];
}

const PieChartWithLabel = ({
  label,
  distributionData,
}: {
  label: string;
  distributionData: DistributionDataPoint[];
}) => {
  return (
    <>
      <h4>{label}</h4>
      <Flex alignItems="center" style={{ marginBottom: '3rem' }} wrap={true}>
        <DistributionPieChart
          dataKey="count"
          distributionData={distributionData}
        />
        <ChartLabel distributionData={distributionData} />
      </Flex>
    </>
  );
};

const toLocalizedGender = (gender: string) => {
  if (gender === 'male') return 'Mann';
  if (gender === 'female') return 'Kvinne';
  return 'Annet';
};

const addGenericDataPoint = (
  selectedDistribution: DistributionDataPoint[],
  selectedDataPoint: string
) => {
  const dataPointEntry = selectedDistribution.find(
    (entry) => entry.name === selectedDataPoint
  );
  if (dataPointEntry) {
    dataPointEntry.count++;
  } else {
    selectedDistribution.push({ name: selectedDataPoint, count: 1 });
  }
};

const addGroupDataPoint = (
  groupDistribution: DistributionDataPoint[],
  userGroups: number[],
  committeeGroupIDs: number[],
  revueGroupIDs: number[]
) => {
  const isAbakom = userGroups.some((userGroup) =>
    committeeGroupIDs.includes(userGroup)
  );
  const isRevue = userGroups.some((userGroup) =>
    revueGroupIDs.includes(userGroup)
  );

  if (isAbakom) {
    addGenericDataPoint(groupDistribution, 'Abakom');
  } else if (isRevue) {
    addGenericDataPoint(groupDistribution, 'Revy');
  } else {
    addGenericDataPoint(groupDistribution, 'Abakus');
  }
};

const addRegistrationDateDataPoint = (
  registrationTimeDistribution: RegistrationDateDataPoint[],
  registrationDate: Dateish,
  isRegister: boolean
) => {
  const formattedDate = moment(registrationDate).format('DD/MM');
  const existingTimeEntry = registrationTimeDistribution.find(
    (entry) => entry.name === formattedDate
  );
  if (existingTimeEntry) {
    if (isRegister) {
      existingTimeEntry.registrations++;
    } else {
      existingTimeEntry.unregistrations++;
    }
  } else {
    registrationTimeDistribution.push({
      name: formattedDate,
      fullDate: registrationDate,
      registrations: isRegister ? 1 : 0,
      unregistrations: isRegister ? 0 : 1,
    });
  }
};

const sortAttendeeStatistics = (attendeeStatistics: AttendeeStatistics) => {
  for (const attendeeStatisticsKey in attendeeStatistics) {
    if (attendeeStatisticsKey === 'registrationTimeDistribution') {
      attendeeStatistics[attendeeStatisticsKey].sort((a, b) =>
        moment(a.fullDate).isBefore(moment(b.fullDate)) ? -1 : 1
      );
      continue;
    }
    attendeeStatistics[attendeeStatisticsKey].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }
};

const createAttendeeDataPoints = (
  registrations: DetailedRegistration[],
  unregistrations: DetailedRegistration[],
  committeeGroupIDs: number[],
  revueGroupIDs: number[]
) => {
  const attendeeStatistics: AttendeeStatistics = {
    genderDistribution: [],
    groupDistribution: [],
    dataTekDistribution: [],
    komTekDistribution: [],
    totalDistribution: [],
    registrationTimeDistribution: [],
  };

  for (const registration of registrations) {
    addRegistrationDateDataPoint(
      attendeeStatistics.registrationTimeDistribution,
      registration.registrationDate,
      true
    );

    // Only admitted users from this point on
    if (!registration.pool) {
      continue;
    }

    const grade = registration.user.grade?.name ?? 'Ikke student';
    if (grade.includes('Datateknologi')) {
      addGenericDataPoint(attendeeStatistics.dataTekDistribution, grade);
      addGenericDataPoint(
        attendeeStatistics.totalDistribution,
        'Datateknologi'
      );
    } else if (grade.includes('Kommunikasjonsteknologi')) {
      addGenericDataPoint(attendeeStatistics.komTekDistribution, grade);
      addGenericDataPoint(
        attendeeStatistics.totalDistribution,
        'Kommunikasjonsteknologi og digital sikkerhet'
      );
    } else {
      addGenericDataPoint(attendeeStatistics.totalDistribution, grade);
    }

    addGenericDataPoint(
      attendeeStatistics.genderDistribution,
      toLocalizedGender(registration.user.gender)
    );

    addGroupDataPoint(
      attendeeStatistics.groupDistribution,
      registration.user.abakusGroups,
      committeeGroupIDs,
      revueGroupIDs
    );
  }

  for (const unregistration of unregistrations) {
    addRegistrationDateDataPoint(
      attendeeStatistics.registrationTimeDistribution,
      unregistration.unregistrationDate,
      false
    );
  }

  sortAttendeeStatistics(attendeeStatistics);

  return attendeeStatistics;
};

const isEventFromPreviousSemester = (eventStartTime: Dateish): boolean => {
  const eventDate = moment(eventStartTime);
  const now = moment();

  return (
    now.year() > eventDate.year() ||
    (now.year() === eventDate.year() &&
      now.month() > 6 &&
      eventDate.month() <= 6)
  );
};

const initialMetricValue = {
  visitors: { title: 'Besøkende', value: 0 },
  pageviews: { title: 'Sidevisninger', value: 0 },
  visitDuration: { title: 'Besøkstid', value: 0 },
};

const calculateMetrics = (data) => {
  // Copy initialMetricValue to avoid mutating it
  const initialValue = JSON.parse(JSON.stringify(initialMetricValue));

  return data.reduce((acc, item) => {
    acc.visitors.value += item.visitors;
    acc.pageviews.value += item.pageviews;
    acc.visitDuration.value += item.visitDuration;

    return acc;
  }, initialValue);
};

const Analytics = ({ eventId }: { eventId: ID }) => {
  const [metrics, setMetrics] = useState<{
    visitors: { title: string; value: number };
    pageviews: { title: string; value: number };
    visitDuration: { title: string; value: number };
  }>(initialMetricValue);
  const [data, setData] = useState<{ date: string; visitors: number }[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    eventId &&
      dispatch(fetchAnalytics(eventId)).then((res) => {
        setData(res.payload);
        setMetrics(calculateMetrics(res.payload));
      });
  }, [eventId, dispatch]);

  return (
    <>
      <Flex wrap gap={40} className={styles.metrics}>
        {Object.values(metrics).map((metric, i) => (
          <>
            {i !== 0 && <div className={styles.metricDivider} />}

            <Flex column justifyContent="center" key={metric.title}>
              <span className={styles.metricHeader}>{metric.title}</span>
              <span className={styles.metricNumber}>
                {metric.value.toLocaleString('no-NO')}
              </span>
            </Flex>
          </>
        ))}
      </Flex>

      <ResponsiveContainer width="100%" aspect={2.0 / 0.8}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="30%"
                stopColor="var(--color-blue-6)"
                stopOpacity={0.4}
              />
              <stop
                offset="75%"
                stopColor="var(--color-blue-5)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-white)"
                stopOpacity={0.2}
              />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              borderColor: 'var(--border-gray)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--lego-card-color)',
            }}
          />
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--color-blue-5)"
            opacity={0.4}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--secondary-font-color)' }}
            stroke="var(--border-gray)"
          />
          <YAxis
            dataKey="visitors"
            tick={{ fill: 'var(--secondary-font-color)' }}
            stroke="var(--border-gray)"
          />
          <Area
            name="Besøkende"
            dataKey="visitors"
            type="monotone"
            stroke="var(--color-blue-6)"
            strokeWidth={3}
            strokeOpacity={1}
            fill="url(#colorView)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

type Props = {
  eventId: ID;
  registrations: DetailedRegistration[];
  unregistrations: DetailedRegistration[];
  committeeGroupIDs: number[];
  revueGroupIDs: number[];
  eventStartTime: Dateish;
};

const EventAttendeeStatistics = ({
  eventId,
  registrations,
  unregistrations,
  committeeGroupIDs,
  revueGroupIDs,
  eventStartTime,
}: Props) => {
  const {
    genderDistribution,
    groupDistribution,
    registrationTimeDistribution,
    dataTekDistribution,
    komTekDistribution,
    totalDistribution,
  } = createAttendeeDataPoints(
    registrations,
    unregistrations,
    committeeGroupIDs,
    revueGroupIDs
  );

  return (
    <>
      {isEventFromPreviousSemester(eventStartTime) && (
        <Card severity="danger">
          <span>
            Dette arrangementet er fra et tidligere semester, og kan derfor ha
            feil fordeling av klassetrinn og gruppetilhørighet. Dette er fordi
            dataen om deltakerne bruker <i>nåværende</i> klassetrinn og
            gruppemedlemskap.
          </span>
        </Card>
      )}

      <Analytics eventId={eventId} />

      {registrations.length === 0 ? (
        <p className={styles.noRegistrationsText}>Ingen er påmeldt enda.</p>
      ) : (
        <div className={styles.chartContainer}>
          <PieChartWithLabel
            label={'Kjønnsfordeling'}
            distributionData={genderDistribution}
          />
          <PieChartWithLabel
            label={'Datateknologi'}
            distributionData={dataTekDistribution}
          />
          <PieChartWithLabel
            label={'Kommunikasjonsteknologi'}
            distributionData={komTekDistribution}
          />
          <PieChartWithLabel
            label={'Data vs Komtek'}
            distributionData={totalDistribution}
          />
          <PieChartWithLabel
            label={'Gruppetilhørighet'}
            distributionData={groupDistribution}
          />

          <h4>Påmeldinger og avmeldinger per dag</h4>
          <LineChart
            width={375}
            height={300}
            data={registrationTimeDistribution}
            margin={{
              top: 10,
              right: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="registrations"
              name="Påmeldinger"
              stroke="var(--color-green-6)"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="unregistrations"
              name="Avmeldinger"
              stroke="var(--lego-red-color)"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      )}
    </>
  );
};

export default EventAttendeeStatistics;
