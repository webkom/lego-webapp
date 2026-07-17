import moment from 'moment-timezone';
import { GroupType } from 'app/models';
import { fetchEvents } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllEvents } from '~/redux/slices/events';
import { selectPaginationNext } from '~/redux/slices/selectors';
import type { ListEvent } from '~/redux/models/Event';

// The backend caps page_size at 60, so this fetches the largest page it allows
const PAGE_SIZE = 60;

const interestEventsQuery = (isPast: boolean) => ({
  ...(isPast
    ? { date_before: moment().format('YYYY-MM-DD'), ordering: '-start_time' }
    : { date_after: moment().format('YYYY-MM-DD'), ordering: 'start_time' }),
  responsible_group_type: GroupType.Interest,
  page_size: PAGE_SIZE,
});

// Backends without the responsible_group_type filter return mixed pages, so
// the type check must also happen client-side
const isInterestEvent = (event: ListEvent) =>
  event.responsibleGroup?.type === GroupType.Interest;

const useInterestEvents = (isPast: boolean) => {
  const query = interestEventsQuery(isPast);

  const { pagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query,
    }),
  );

  const events = useAppSelector((state) =>
    selectAllEvents<ListEvent>(state, { pagination }),
  ).filter(isInterestEvent);

  const dispatch = useAppDispatch();

  return {
    events,
    fetching: pagination.fetching,
    hasMore: pagination.hasMore,
    fetch: () => dispatch(fetchEvents({ query })),
    fetchMore: () => dispatch(fetchEvents({ query, next: true })),
  };
};

export default useInterestEvents;
