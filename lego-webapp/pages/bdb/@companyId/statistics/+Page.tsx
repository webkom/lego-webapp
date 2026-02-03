import { Card, Flex, Icon } from '@webkom/lego-bricks'; // Added Card
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import DistributionBarChart from '~/components/Chart/BarChart';
import DistributionPieChart from '~/components/Chart/PieChart';
import { CHART_COLORS } from '~/components/Chart/utils';
import InfoBubble from '~/components/InfoBubble';
import { useAppSelector } from '~/redux/hooks';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from '~/redux/slices/companies';
import { useParams } from '~/utils/useParams';

type DistributionDataPoint = {
  label: string;
  count: number;
};

type Info = {
  icon: string;
  data: number | string;
  meta: string;
};

type CompanyDataProps = {
  info: Info[];
};

const CompanyData = ({ info }: CompanyDataProps) => {
  return info.map((dataPoint, i) => (
    <InfoBubble
      key={i}
      icon={dataPoint.icon}
      data={String(dataPoint.data)}
      meta={dataPoint.meta}
      style={{
        order: i,
      }}
    />
  ));
};

const getEventsPerYearData = (): DistributionDataPoint[] => [
  { label: '2021', count: 4 },
  { label: '2022', count: 8 },
  { label: '2023', count: 6 },
  { label: '2024', count: 12 },
  { label: '2025', count: 9 },
];

const getEventTypeData = (): DistributionDataPoint[] => [
  { label: 'Bedriftspresentasjon', count: 35 },
  { label: 'Kurs', count: 12 },
  { label: 'Bedriftsbesøk', count: 5 },
  { label: 'Annet', count: 2 },
];

const EventItem = ({ event }: { event: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const eventStats: Info[] = [
    {
      icon: 'people',
      data: event.registrationCount || 0,
      meta: 'Påmeldte',
    },
    {
      icon: 'list',
      data: event.waitingRegistrationCount || 0,
      meta: 'Venteliste',
    },
    {
      icon: 'star',
      data: (Math.random() * 2 + 3).toFixed(1),
      meta: 'Tilfredshet',
    },
    {
      icon: 'chatbox',
      data: Math.floor(Math.random() * 40),
      meta: 'Svar',
    },
  ];

  return (
    <Card style={{ padding: '0' }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ padding: '15px', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex column>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {event.title}
          </span>
          <span
            style={{ color: 'var(--lego-font-color-gray)', fontSize: '0.9rem' }}
          >
            {new Date(event.startTime).toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </Flex>

        <Icon iconNode={isOpen ? <ChevronUp /> : <ChevronDown />} />
      </Flex>

      {isOpen && (
        <div
          style={{
            borderTop: '1px solid var(--lego-border-color)',
            padding: '20px',
            background: 'var(--lego-background-color-light)',
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
            Nøkkeltall for arrangementet
          </h4>
          <Flex wrap gap="var(--spacing-lg)">
            <CompanyData info={eventStats} />
          </Flex>
        </div>
      )}
    </Card>
  );
};

const CompanyStats = () => {
  const { companyId } = useParams<{ companyId: string }>();

  const events = useAppSelector((state) =>
    selectEventsForCompany(state, companyId),
  );
  const joblistings = useAppSelector((state) =>
    selectJoblistingsForCompany(state, companyId),
  );

  const info: Info[] = [
    { icon: 'calendar', data: events.length, meta: 'Arrangementer' },
    { icon: 'briefcase', data: joblistings.length, meta: 'Jobbannonser' },
    { icon: 'people', data: '250+', meta: 'Studenter møtt' },
  ];

  const eventsPerYear = getEventsPerYearData();
  const eventTypes = getEventTypeData();

  return (
    <Flex column gap="var(--spacing-lg)">
      <section>
        <h3>Oversikt</h3>
        <Flex wrap gap="var(--spacing-md)" justifyContent="flex-start">
          <CompanyData info={info} />
        </Flex>
      </section>

      <section>
        <h3>Detaljert Statistikk</h3>
        <Flex wrap gap="var(--spacing-xl)" justifyContent="space-between">
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <h4>Arrangementer per år</h4>
            <div style={{ height: '300px' }}>
              <DistributionBarChart
                distributionData={eventsPerYear}
                chartColors={CHART_COLORS}
              />
            </div>
          </div>
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <h4>Fordeling av arrangementstyper</h4>
            <div
              style={{
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <DistributionPieChart
                distributionData={eventTypes}
                chartColors={CHART_COLORS}
              />
            </div>
          </div>
        </Flex>
      </section>

      <section>
        <h3>Arrangementshistorikk</h3>
        <p style={{ marginBottom: '15px', color: 'gray' }}>
          Klikk på et arrangement for å se detaljerte tall.
        </p>
        <Flex column gap="10px">
          {events
            .slice()
            .sort(
              (a, b) =>
                new Date(b.startTime).getTime() -
                new Date(a.startTime).getTime(),
            )
            .map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          {events.length === 0 && <p>Ingen arrangementer funnet.</p>}
        </Flex>
      </section>
    </Flex>
  );
};

export default CompanyStats;
