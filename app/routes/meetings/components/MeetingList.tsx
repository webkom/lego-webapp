import { LoadingIndicator, Button, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAll, getEndpoint } from 'app/actions/MeetingActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { Tag } from 'app/components/Tags';
import Time from 'app/components/Time';
import {
  selectGroupedMeetings,
  type MeetingSection,
} from 'app/reducers/meetings';
import { selectPagination } from 'app/reducers/selectors';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createQueryString from 'app/utils/createQueryString';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './MeetingList.css';
import type { ID } from 'app/store/models';
import type { ListMeeting } from 'app/store/models/Meeting';
import type { CurrentUser } from 'app/store/models/User';

function MeetingListItem({
  meeting,
  userId,
}: {
  meeting: ListMeeting;
  userId: ID;
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
          <Flex alignItems="center" gap="1rem">
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
  const dateAfter = moment().format('YYYY-MM-DD');
  const dateBefore = moment().format('YYYY-MM-DD');
  const fetchMoreString = createQueryString({
    date_after: dateAfter,
  });
  const fetchOlderString = createQueryString({
    date_before: dateBefore,
    ordering: '-start_time',
  });
  const showFetchMore = useAppSelector((state) =>
    selectPagination('meetings', {
      queryString: fetchMoreString,
    })(state)
  );
  const showFetchOlder = useAppSelector((state) =>
    selectPagination('meetings', {
      queryString: fetchOlderString,
    })(state)
  );
  const meetingSections = useAppSelector(selectGroupedMeetings);
  const loading = useAppSelector((state) => state.meetings.fetching);
  const pagination = useAppSelector((state) => state.meetings.pagination);

  const { currentUser } = useUserContext();

  const dispatch = useAppDispatch();

  const fetchData = useCallback(
    ({
      dateAfter,
      dateBefore,
      ordering,
      loadNextPage,
    }: {
      dateAfter?: string;
      dateBefore?: string;
      ordering?: string;
      loadNextPage?: boolean;
    } = {}) => {
      const query = {
        date_after: dateAfter,
        date_before: dateBefore,
        ordering,
      };

      if (dateBefore && dateAfter) {
        query.page_size = '60';
      }

      const queryString = createQueryString(query);
      const endpoint = getEndpoint(pagination, queryString, loadNextPage);

      if (!endpoint) {
        return Promise.resolve();
      }

      return dispatch(
        fetchAll({
          endpoint,
          queryString,
        })
      );
    },
    [pagination, dispatch]
  );

  const fetchMore = () =>
    fetchData({
      dateAfter: moment().subtract(0, 'weeks').format('YYYY-MM-DD'),
      loadNextPage: true,
    });

  const fetchOlder = useCallback(
    () =>
      fetchData({
        dateBefore: moment().subtract(0, 'weeks').format('YYYY-MM-DD'),
        ordering: '-start_time',
        loadNextPage: true,
      }),
    [fetchData]
  );

  usePreparedEffect(
    'fetchMeetingList',
    () =>
      fetchData({
        dateAfter: moment().subtract(0, 'weeks').format('YYYY-MM-DD'),
      }),
    []
  );

  useEffect(() => {
    if (showFetchOlder && meetingSections.length === 0 && !loading) {
      fetchOlder();
    }
  }, [showFetchOlder, meetingSections.length, loading, fetchOlder]);

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
      {!meetingSections || loading ? (
        <LoadingIndicator loading={loading} />
      ) : (
        <MeetingListView currentUser={currentUser} sections={meetingSections} />
      )}
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
