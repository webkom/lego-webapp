import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import Pill from 'app/components/Pill';
import Time from 'app/components/Time';
import type { MeetingSection } from 'app/reducers/meetings';
import type { UserEntity } from 'app/reducers/users';
import type { ListMeeting } from 'app/store/models/Meeting';
import type { CurrentUser } from 'app/store/models/User';
import styles from './MeetingList.css';

function MeetingListItem({
  meeting,
  username,
}: {
  meeting: ListMeeting;
  username: string;
}) {
  const isDone = moment(meeting.startTime) < moment();
  return (
    <div
      style={{
        borderColor: isDone ? 'var(--color-gray-4)' : 'var(--lego-red-color)',
      }}
      className={styles.meetingItem}
    >
      <div>
        <Link to={`/meetings/${meeting.id}`}>
          <h3 className={styles.meetingItemTitle}>
            {meeting.title}
            {username === meeting.createdBy && (
              <Pill
                style={{
                  marginLeft: 10,
                }}
              >
                Eier
              </Pill>
            )}
            {username === meeting.reportAuthor && (
              <Pill
                style={{
                  marginLeft: 10,
                }}
              >
                Referent
              </Pill>
            )}
          </h3>
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
  sections: Array<MeetingSection>;
  currentUser: UserEntity;
}) => (
  <div>
    {sections.map((item, key) => (
      <div key={key}>
        <h3 className={styles.heading}>{item.title}</h3>
        {item.meetings.map((item, key) => (
          <MeetingListItem
            key={key}
            username={currentUser.username}
            meeting={item}
          />
        ))}
      </div>
    ))}
    {!sections.length && (
      <h3 className={styles.noDataMessage}>Ingen møter å vise</h3>
    )}
  </div>
);

type Props = {
  meetingSections: MeetingSection[];
  currentUser: CurrentUser;
  loading: boolean;
  fetchMore: () => Promise<void>;
  fetchOlder: () => Promise<void>;
  showFetchMore: boolean;
  showFetchOlder: boolean;
};
const MeetingList = ({
  meetingSections,
  currentUser,
  loading,
  fetchMore,
  fetchOlder,
  showFetchMore,
  showFetchOlder,
}: Props) => {
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
      ></NavigationTab>
      {!meetingSections || loading ? (
        <LoadingIndicator loading />
      ) : (
        <MeetingListView currentUser={currentUser} sections={meetingSections} />
      )}
      {showFetchMore && <Button onClick={fetchMore}>Last flere</Button>}
      {showFetchOlder && (
        <Button flat onClick={fetchOlder}>
          Hent gamle
        </Button>
      )}
    </Content>
  );
};

export default MeetingList;
