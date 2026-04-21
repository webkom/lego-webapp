import { Skeleton } from '@webkom/lego-bricks';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EventRows from './EventRows';
import pageStyles from './Page.module.css';
import PageHero from './PageHero';
import { ROW_ORDER } from './types';
import { useInterestEvents } from './useInterestEvents';
import { GROUP_LABELS, GROUP_SUBTITLES, getWeekSubtitle } from './utils';

const EventListSkeleton = () => (
  <>
    {ROW_ORDER.map((groupName) => (
      <div key={groupName}>
        <Skeleton height={24} width={160} style={{ marginBottom: 12 }} />
        <Skeleton height={200} />
      </div>
    ))}
  </>
);

const InterestEventList = () => {
  const { groupedEvents, hasEvents, isFetching } = useInterestEvents();
  const [search, setSearch] = useState('');

  const subtitles = { ...GROUP_SUBTITLES, denneUken: getWeekSubtitle() };

  const groupCount = useMemo(() => {
    const ids = new Set(
      Object.values(groupedEvents)
        .flat()
        .map((e) => e.responsibleGroup?.id)
        .filter(Boolean),
    );
    return ids.size;
  }, [groupedEvents]);

  const upcomingCount =
    groupedEvents.dineGrupper.length +
    groupedEvents.denneUken.length +
    groupedEvents.kommende.length;

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedEvents;
    const q = search.toLowerCase();
    return Object.fromEntries(
      ROW_ORDER.map((key) => [
        key,
        groupedEvents[key].filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.responsibleGroup?.name.toLowerCase().includes(q),
        ),
      ]),
    ) as typeof groupedEvents;
  }, [groupedEvents, search]);

  return (
    <div className={pageStyles.frame}>
      <Helmet title="Interessearrangementer" />
      <PageHero
        groupCount={groupCount}
        upcomingCount={upcomingCount}
        search={search}
        onSearch={setSearch}
      />
      <hr className={pageStyles.divider} />
      {ROW_ORDER.map((groupName) => (
        <EventRows
          key={groupName}
          title={GROUP_LABELS[groupName]}
          subtitle={subtitles[groupName]}
          events={filteredGroups[groupName]}
        />
      ))}
      {!hasEvents && isFetching && <EventListSkeleton />}
    </div>
  );
};

export default InterestEventList;
