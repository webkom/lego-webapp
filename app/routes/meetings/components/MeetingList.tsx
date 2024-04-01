import { LoadingIndicator, Button, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAll } from 'app/actions/MeetingActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { Tag } from 'app/components/Tags';
import Time from 'app/components/Time';
import { useCurrentUser } from 'app/reducers/auth';
import {
  selectGroupedMeetings,
  type MeetingSection,
} from 'app/reducers/meetings';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './MeetingList.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ListMeeting } from 'app/store/models/Meeting';
import type { CurrentUser } from 'app/store/models/User';

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
        <Link to={`/meetings/${meeting.id}`}>
          <Flex alignItems="center" gap="var(--spacing-md)">
            <h3 className={styles.meetingItemTitle}>{meeting.title}</h3>
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
        </Link>
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
}: {
  sections: MeetingSection[];
  currentUser: CurrentUser;
}) => (
  <div>
    {sections.map((item, key) => (
      <div key={key}>
        <h3 className={styles.heading}>{item.title}</h3>
        {item.meetings.map((item, key) => (
          <MeetingListItem key={key} userId={currentUser.id} meeting={item} />
        ))}
      </div>
    ))}
    {!sections.length && (
      <h3 className={styles.noDataMessage}>Ingen møter å vise</h3>
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
  const fetchMorePagination = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/meetings/',
      query: fetchUpcomingQuery,
      entity: EntityType.Meetings,
    })(state),
  );
  const showFetchMore = fetchMorePagination.pagination.hasMore;
  const fetchOlderPagination = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/meetings/',
      query: fetchOlderQuery,
      entity: EntityType.Meetings,
    })(state),
  );
  const showFetchOlder = fetchOlderPagination.pagination.hasMore;
  const meetingSections = useAppSelector(selectGroupedMeetings);
  const loading = useAppSelector((state) => state.meetings.fetching);

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

  useEffect(() => {
    if (
      !initialFetchAttempted &&
      showFetchOlder &&
      meetingSections.length === 0 &&
      !loading
    ) {
      fetchOlder();
      setInitialFetchAttempted(true);
    }
  }, [
    initialFetchAttempted,
    showFetchOlder,
    meetingSections.length,
    loading,
    fetchOlder,
  ]);

  return (
    <Content>
      <Helmet title="Dine møter" />
      <NavigationTab
        title="Dine møter"
        details={
          <Link to="/meetings/create">
            <Button>Nytt møte</Button>
          </Link>
        }
      />
      {!meetingSections || !currentUser || loading ? (
        <LoadingIndicator loading={loading} />
      ) : (
        <MeetingListView currentUser={currentUser} sections={meetingSections} />
      )}
      <LoadingIndicator loading={loading} />
      {showFetchMore && <Button onClick={fetchMore}>Last inn flere</Button>}
      {showFetchOlder && (
        <Button flat onClick={fetchOlder}>
          Hent gamle
        </Button>
      )}
    </Content>
  );
};

export default guardLogin(MeetingList);
