import { Card, Flex } from '@webkom/lego-bricks';
import { Send } from 'lucide-react';
import moment from 'moment';
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
import { GroupType, type Dateish } from 'app/models';
import ChartLabel from '~/components/Chart/ChartLabel';
import DistributionPieChart from '~/components/Chart/PieChart';
import EmptyState from '~/components/EmptyState';
import { useAppSelector } from '~/redux/hooks';
import { Gender } from '~/redux/models/User';
import {
  selectEventById,
  selectRegistrationGroups,
} from '~/redux/slices/events';
import { selectGroupsByType } from '~/redux/slices/groups';
import { useParams } from '~/utils/useParams';
import Analytics from './Analytics';
import styles from './EventAttendeeStatistics.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { DistributionDataPoint } from '~/components/Chart/utils';
import type { AdministrateEvent } from '~/redux/models/Event';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

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
  userGroups: EntityId[],
  committeeGroupIDs: EntityId[],
  revueGroupIDs: EntityId[],
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
  registrations: SelectedAdminRegistration[],
  unregistrations: SelectedAdminRegistration[],
  committeeGroupIDs: EntityId[],
  revueGroupIDs: EntityId[],
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

const isEventFromPreviousSemester = (eventStartTime?: Dateish): boolean => {
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
  const event = useAppSelector((state) =>
    selectEventById<AdministrateEvent>(state, eventId),
  );
  const { registered, unregistered } = useAppSelector((state) =>
    selectRegistrationGroups(state, {
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

  const hasEventEnded = moment().isAfter(moment(event?.endTime));

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

      <Flex column gap="var(--spacing-sm)">
        <div>
          <h2>Analyse</h2>
          <span className="secondaryFontColor">
            Analyse av besøkende på arrangementssiden
          </span>
        </div>
        <Analytics viewStartTime={viewStartTime} viewEndTime={viewEndTime} />
      </Flex>

      <Flex column gap="var(--spacing-sm)">
        <div>
          <h2>Statistikk</h2>
          <span className="secondaryFontColor">
            Statistikk av brukerne som {hasEventEnded ? 'var' : 'er'} påmeldt
            arrangementet
          </span>
        </div>

        {registered.length === 0 ? (
          <EmptyState
            iconNode={<Send />}
            body={
              hasEventEnded
                ? 'Arrangementet hadde ingen påmeldinger'
                : 'Ingen er påmeldt enda'
            }
          />
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

        {registered.length > 0 && (
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
        )}
      </Flex>
    </>
  );
};

export default EventAttendeeStatistics;
