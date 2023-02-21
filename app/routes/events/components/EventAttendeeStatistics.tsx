import moment from 'moment';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import type { Dateish, EventRegistration } from 'app/models';
import styles from './Event.css';

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
  registrations: Array<EventRegistration>,
  unregistrations: Array<EventRegistration>,
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

const EventAttendeeStatistics = ({
  registrations,
  unregistrations,
  committeeGroupIDs,
  revueGroupIDs,
  eventStartTime,
}: {
  registrations: Array<EventRegistration>;
  unregistrations: Array<EventRegistration>;
  committeeGroupIDs: number[];
  revueGroupIDs: number[];
  eventStartTime: Dateish;
}) => {
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
        <Flex alignItems="center" className={styles.eventWarning}>
          <Icon name="warning" />
          <span>
            Dette arrangementet er fra et tidligere semester, og kan derfor ha
            feil fordeling av klassetrinn og gruppetilhørighet. Dette er fordi
            dataen om deltakerne bruker <i>nåværende</i> klassetrinn og
            gruppemedlemskap.
          </span>
        </Flex>
      )}
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
