import { DistributionDataPoint } from 'app/components/Chart/utils';
import type { Dateish, EventRegistration } from 'app/models';
import DistributionPieChart from 'app/components/Chart/PieChart';
import ChartLabel from 'app/components/Chart/ChartLabel';
import { Flex } from 'app/components/Layout';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';

interface RegistrationDateDataPoint {
  name: string;
  registrations: number;
  unregistrations: number;
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
      <Flex alignItems="center">
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
  const formatedDate = moment(registrationDate).format('DD/MM');
  const existingTimeEntry = registrationTimeDistribution.find(
    (entry) => entry.name === formatedDate
  );
  if (existingTimeEntry) {
    if (isRegister) {
      existingTimeEntry.registrations++;
    } else {
      existingTimeEntry.unregistrations++;
    }
  } else {
    registrationTimeDistribution.push({
      name: formatedDate,
      registrations: isRegister ? 1 : 0,
      unregistrations: isRegister ? 0 : 1,
    });
  }
};

const createAttendeeDataPoints = (
  registrations: Array<EventRegistration>,
  unregistrations: Array<EventRegistration>,
  committeeGroupIDs: number[],
  revueGroupIDs: number[]
) => {
  const attendeeStatistics: {
    genderDistribution: DistributionDataPoint[];
    groupDistribution: DistributionDataPoint[];
    dataTekDistribution: DistributionDataPoint[];
    komTekDistribution: DistributionDataPoint[];
    totalDistribution: DistributionDataPoint[];
    registrationTimeDistribution: RegistrationDateDataPoint[];
  } = {
    genderDistribution: [],
    groupDistribution: [],
    dataTekDistribution: [],
    komTekDistribution: [],
    totalDistribution: [],
    registrationTimeDistribution: [],
  };

  const dataTekTotal: DistributionDataPoint = {
    name: 'Datateknologi',
    count: 0,
  };
  const komTekTotal: DistributionDataPoint = {
    name: 'Kommunikasjonsteknologi og digital sikkerhet',
    count: 0,
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
      dataTekTotal.count++;
    } else if (grade.includes('Kommunikasjonsteknologi')) {
      addGenericDataPoint(attendeeStatistics.komTekDistribution, grade);
      komTekTotal.count++;
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

  attendeeStatistics.totalDistribution.push(dataTekTotal);
  attendeeStatistics.totalDistribution.push(komTekTotal);

  attendeeStatistics.dataTekDistribution.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  attendeeStatistics.komTekDistribution.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return attendeeStatistics;
};

const EventAttendeeStatistics = ({
  registrations,
  unregistrations,
  committeeGroupIDs,
  revueGroupIDs,
}: {
  registrations: Array<EventRegistration>;
  unregistrations: Array<EventRegistration>;
  committeeGroupIDs: number[];
  revueGroupIDs: number[];
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
      {registrations.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Ingen er påmeldt enda.</p>
      ) : (
        <>
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
            width={500}
            height={300}
            data={registrationTimeDistribution}
            margin={{
              top: 5,
              right: 30,
              left: 20,
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
              stroke="green"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="unregistrations"
              name="Avmeldinger"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </>
      )}
    </>
  );
};

export default EventAttendeeStatistics;
