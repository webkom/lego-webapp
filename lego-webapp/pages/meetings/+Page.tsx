import {
  LoadingIndicator,
  Button,
  Flex,
  LinkButton,
  ButtonGroup,
  Page,
  Icon,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { CalendarOff, Pin } from 'lucide-react';
import moment from 'moment-timezone';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import { Tag } from '~/components/Tags';
import Time from '~/components/Time';
import { fetchAll, fetchTemplates } from '~/redux/actions/MeetingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { useCurrentUser } from '~/redux/slices/auth';
import {
  selectGroupedMeetings,
  selectMyMeetingTemplates,
  type MeetingSection,
} from '~/redux/slices/meetings';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import styles from './MeetingList.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { Pagination } from '~/redux/legoAdapter/buildPaginationReducer';
import type { ListMeeting } from '~/redux/models/Meeting';
import type { CurrentUser } from '~/redux/models/User';

function MeetingListItem({
  meeting,
  userId,
}: {
  meeting: ListMeeting;
  userId: EntityId;
}) {
  const isDone = moment(meeting.endTime) < moment();

  return (
    <div
      style={{
        borderColor: isDone ? 'var(--color-gray-4)' : 'var(--lego-red-color)',
      }}
      className={styles.meetingItem}
    >
      <div>
        <a href={`/meetings/${meeting.id}`}>
          <Flex alignItems="center" gap="var(--spacing-md)">
            {meeting.isRecurring &&
              meeting.isTemplate &&
              userId === meeting.createdBy && <Icon iconNode={<Pin />} />}
            <h3 className={styles.meetingItemTitle}>{meeting.title}</h3>
            {meeting.isRecurring && (
              <Tag tag="Ukentlig" color="cyan" icon="refresh" />
            )}
            {userId === meeting.createdBy && (
              <Tag
                tag="Forfatter"
                color="blue"
                icon="shield-checkmark-outline"
              />
            )}
            {userId === meeting.reportAuthor && (
              <Tag
                tag="Referent"
                color="purple"
                icon="pencil-outline"
                iconSize={13}
              />
            )}
          </Flex>
        </a>
        <div className={styles.meetingTime}>
          <Time time={meeting.startTime} format="ll - HH:mm" />
          {` • Lokasjon: ${meeting.location}`}
        </div>
      </div>
    </div>
  );
}

const MeetingListView = ({
  sections,
  currentUser,
  fetchMorePagination,
  fetchOlderPagination,
}: {
  sections: MeetingSection[];
  currentUser: CurrentUser;
  fetchMorePagination: Pagination;
  fetchOlderPagination: Pagination;
}) => (
  <div>
    {sections.map((item, key) => (
      <div key={key}>
        <h3 className={styles.heading}>{item.title}</h3>
        {item.meetings
          .sort((m: ListMeeting, n: ListMeeting) => n.recurring - m.recurring)
          .map((item, key) => (
            <MeetingListItem key={key} userId={currentUser.id} meeting={item} />
          ))}
      </div>
    ))}
    {!sections.length && (
      <EmptyState
        iconNode={<CalendarOff />}
        header={`Du har ingen ${
          !fetchMorePagination.hasMore && fetchOlderPagination.hasMore
            ? 'kommende'
            : ''
        } møter`}
        body="Opprett et nytt et da vel!"
      />
    )}
  </div>
);

const MeetingList = () => {
  const [initialFetchAttempted, setInitialFetchAttempted] = useState(false);

  const fetchUpcomingQuery = useMemo(
    () => ({
      date_after: moment().format('YYYY-MM-DD'),
    }),
    [],
  );
  const fetchOlderQuery = useMemo(
    () => ({
      date_before: moment().format('YYYY-MM-DD'),
      ordering: '-start_time',
    }),
    [],
  );
  const { pagination: fetchMorePagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/meetings/',
      query: fetchUpcomingQuery,
      entity: EntityType.Meetings,
    }),
  );
  const { pagination: fetchOlderPagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/meetings/',
      query: fetchOlderQuery,
      entity: EntityType.Meetings,
    }),
  );
  const meetingSections = useAppSelector(selectGroupedMeetings);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  const fetchMore = useCallback(
    () =>
      dispatch(
        fetchAll({
          query: fetchUpcomingQuery,
          next: true,
        }),
      ),
    [dispatch, fetchUpcomingQuery],
  );

  const fetchOlder = useCallback(
    () =>
      dispatch(
        fetchAll({
          query: fetchOlderQuery,
          next: true,
        }),
      ),
    [dispatch, fetchOlderQuery],
  );

  usePreparedEffect(
    'fetchMeetingList',
    () =>
      fetchAll({
        query: fetchUpcomingQuery,
      }),
    [],
  );

  usePreparedEffect('fetchgMeetingTemplates', () => fetchTemplates(), []);

  const myTemplates = useAppSelector(selectMyMeetingTemplates);

  useEffect(() => {
    if (
      !initialFetchAttempted &&
      fetchOlderPagination.hasMore &&
      meetingSections.length === 0 &&
      !fetchOlderPagination.fetching
    ) {
      fetchOlder();
      setInitialFetchAttempted(true);
    }
  }, [
    initialFetchAttempted,
    fetchOlderPagination.hasMore,
    fetchOlderPagination.fetching,
    meetingSections.length,
    fetchOlder,
  ]);

  return (
    <Page
      title="Dine møter"
      actionButtons={<LinkButton href="/meetings/new">Nytt møte</LinkButton>}
    >
      <Helmet title="Dine møter" />
      {meetingSections && currentUser && (
        <>
          <h3 className={styles.heading}>Dine maler</h3>
          {myTemplates.map((m) => (
            <MeetingListItem key={m.id} meeting={m} userId={m.createdBy} />
          ))}
          <MeetingListView
            currentUser={currentUser}
            sections={meetingSections}
            fetchMorePagination={fetchMorePagination}
            fetchOlderPagination={fetchOlderPagination}
          />
        </>
      )}

      <LoadingIndicator
        loading={fetchMorePagination.fetching || fetchOlderPagination.fetching}
      />
      <ButtonGroup>
        {fetchMorePagination.hasMore && (
          <Button onPress={fetchMore}>Last inn flere</Button>
        )}
        {fetchOlderPagination.hasMore && (
          <Button flat onPress={fetchOlder}>
            Hent gamle
          </Button>
        )}
      </ButtonGroup>
    </Page>
  );
};

export default guardLogin(MeetingList);
