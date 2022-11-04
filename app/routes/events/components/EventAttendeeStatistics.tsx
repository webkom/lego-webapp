// @flow

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

const ABAKOM_GROUP_IDS = [4, 5, 6, 7, 8, 9, 10, 11, 98, 231];
const REVY_GROUP_IDS = [59, 119, 120, 121, 123, 124, 153, 154, 214, 222, 225];

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

const createGenericDataPoint = (
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

const createGroupDataPoint = (
  groupDistribution: DistributionDataPoint[],
  userGroups: number[]
) => {
  const isAbakom = userGroups.some((userGroup) =>
    ABAKOM_GROUP_IDS.includes(userGroup)
  );
  const isRevue = userGroups.some((userGroup) =>
    REVY_GROUP_IDS.includes(userGroup)
  );

  if (isAbakom) {
    createGenericDataPoint(groupDistribution, 'Abakom');
  } else if (isRevue) {
    createGenericDataPoint(groupDistribution, 'Revy');
  } else {
    createGenericDataPoint(groupDistribution, 'Abakus');
  }
};

const createRegistrationDateDataPoint = (
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
  unregistrations: Array<EventRegistration>
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
    name: 'Komunikasjonsteknologi',
    count: 0,
  };

  for (const registration of registrations) {
    createRegistrationDateDataPoint(
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
      createGenericDataPoint(attendeeStatistics.dataTekDistribution, grade);
      dataTekTotal.count++;
    } else if (grade.includes('Kommunikasjonsteknologi')) {
      createGenericDataPoint(attendeeStatistics.komTekDistribution, grade);
      komTekTotal.count++;
    } else {
      createGenericDataPoint(attendeeStatistics.totalDistribution, grade);
    }

    createGenericDataPoint(
      attendeeStatistics.genderDistribution,
      toLocalizedGender(registration.user.gender)
    );

    createGroupDataPoint(
      attendeeStatistics.groupDistribution,
      registration.user.abakusGroups
    );
  }

  for (const unregistration of unregistrations) {
    createRegistrationDateDataPoint(
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
}: {
  registrations: Array<EventRegistration>;
  unregistrations: Array<EventRegistration>;
}) => {
  const {
    genderDistribution,
    groupDistribution,
    registrationTimeDistribution,
    dataTekDistribution,
    komTekDistribution,
    totalDistribution,
  } = createAttendeeDataPoints(registrations, unregistrations);

  return (
    <>
      <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>
        Deltakerstatistikk
      </h3>

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
