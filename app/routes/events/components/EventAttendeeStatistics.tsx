import { Card, Flex } from '@webkom/lego-bricks';
import { Send } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import EmptyState from 'app/components/EmptyState';
import { GroupType, type Dateish } from 'app/models';
import { getRegistrationGroups, selectEventById } from 'app/reducers/events';
import { selectGroupsByType } from 'app/reducers/groups';
import { useAppSelector } from 'app/store/hooks';
import { Gender } from 'app/store/models/User';
import Analytics from './Analytics';
import styles from './EventAttendeeStatistics.css';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import type { DetailedRegistration } from 'app/store/models/Registration';

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
    <Card>
      <Card.Header>{label}</Card.Header>
      <Flex alignItems="center" wrap column>
        <DistributionPieChart distributionData={distributionData} />
        <ChartLabel distributionData={distributionData} />
      </Flex>
    </Card>
  );
};

const addGenericDataPoint = (
  selectedDistribution: DistributionDataPoint[],
  selectedDataPoint: string,
) => {
  const dataPointEntry = selectedDistribution.find(
    (entry) => entry.name === selectedDataPoint,
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
  revueGroupIDs: number[],
) => {
  const isAbakom = userGroups.some((userGroup) =>
    committeeGroupIDs.includes(userGroup),
  );
  const isRevue = userGroups.some((userGroup) =>
    revueGroupIDs.includes(userGroup),
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
  isRegister: boolean,
) => {
  const formattedDate = moment(registrationDate).format('DD/MM');
  const existingTimeEntry = registrationTimeDistribution.find(
    (entry) => entry.name === formattedDate,
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
        moment(a.fullDate).isBefore(moment(b.fullDate)) ? -1 : 1,
      );
      continue;
    }
    attendeeStatistics[attendeeStatisticsKey].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }
};

const createAttendeeDataPoints = (
  registrations: DetailedRegistration[],
  unregistrations: DetailedRegistration[],
  committeeGroupIDs: number[],
  revueGroupIDs: number[],
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
      true,
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
        'Datateknologi',
      );
    } else if (grade.includes('Kommunikasjonsteknologi')) {
      addGenericDataPoint(attendeeStatistics.komTekDistribution, grade);
      addGenericDataPoint(
        attendeeStatistics.totalDistribution,
        'Cybersikkerhet og datakommunikasjon',
      );
    } else {
      addGenericDataPoint(attendeeStatistics.totalDistribution, grade);
    }

    addGenericDataPoint(
      attendeeStatistics.genderDistribution,
      registration.user.gender ? Gender[registration.user.gender] : 'Ukjent',
    );

    addGroupDataPoint(
      attendeeStatistics.groupDistribution,
      registration.user.abakusGroups,
      committeeGroupIDs,
      revueGroupIDs,
    );
  }

  for (const unregistration of unregistrations) {
    addRegistrationDateDataPoint(
      attendeeStatistics.registrationTimeDistribution,
      unregistration.unregistrationDate,
      false,
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

type Props = {
  viewStartTime: Dateish;
  viewEndTime: Dateish;
};

const EventAttendeeStatistics = ({ viewStartTime, viewEndTime }: Props) => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) => selectEventById(state, { eventId }));
  const { registered, unregistered } = useAppSelector((state) =>
    getRegistrationGroups(state, {
      eventId: eventId,
    }),
  );
  const committees = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Committee),
  );
  const committeeGroupIDs = committees.map((group) => group.id);
  const revueGroups = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Revue),
  );
  const revueGroupIDs = revueGroups.map((group) => group.id);

  const {
    genderDistribution,
    groupDistribution,
    registrationTimeDistribution,
    dataTekDistribution,
    komTekDistribution,
    totalDistribution,
  } = createAttendeeDataPoints(
    registered,
    unregistered,
    committeeGroupIDs,
    revueGroupIDs,
  );

  return (
    <>
      {isEventFromPreviousSemester(event?.startTime) && (
        <Card severity="warning">
          <span>
            Dette arrangementet er fra et tidligere semester, og kan derfor ha
            feil fordeling av klassetrinn og gruppetilhørighet. Dette er fordi
            dataen om deltakerne bruker <i>nåværende</i> klassetrinn og
            gruppemedlemskap.
          </span>
        </Card>
      )}

      <h2 className={styles.sectionDividerTitle}>Analyse</h2>
      <p className={styles.sectionDividerDescription}>
        Analyse av besøkende på arrangementssiden
      </p>

      <Analytics viewStartTime={viewStartTime} viewEndTime={viewEndTime} />

      <h2 className={styles.sectionDividerTitle}>Statistikk</h2>
      <p className={styles.sectionDividerDescription}>
        Statistikk av brukerne som{' '}
        {moment().isAfter(moment(event.endTime)) ? 'var' : 'er'} påmeldt
        arrangementet
      </p>

      {registered.length === 0 ? (
        <EmptyState iconNode={<Send />} body="Ingen er påmeldt enda" />
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
            label={'Cybersikkerhet og datakommunikasjon'}
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
        </div>
      )}

      <Card className={styles.graphCard}>
        <Card.Header>Påmeldinger og avmeldinger per dag</Card.Header>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
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
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default EventAttendeeStatistics;
