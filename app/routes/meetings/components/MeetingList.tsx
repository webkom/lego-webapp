import moment from 'moment-timezone';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Pill from 'app/components/Pill';
import Time from 'app/components/Time';
import type { MeetingEntity, MeetingSection } from 'app/reducers/meetings';
import type { UserEntity } from 'app/reducers/users';
import styles from './MeetingList.css';
import Toolbar from './Toolbar';

function MeetingListItem({
  meeting,
  username,
}: {
  meeting: MeetingEntity;
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
        <h2 className={styles.heading}>{item.title}</h2>
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
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        Ingen møter å vise
      </h2>
    )}
  </div>
);

type Props = {
  meetingSections: Array<MeetingSection>;
  currentUser: UserEntity;
  loading: boolean;
  fetchMore: () => Promise<any>;
  fetchOlder: () => Promise<any>;
  showFetchMore: boolean;
  showFetchOlder: boolean;
};
export default class MeetingList extends Component<Props> {
  render() {
    const {
      meetingSections,
      currentUser,
      loading,
      fetchMore,
      fetchOlder,
      showFetchMore,
      showFetchOlder,
    } = this.props;
    return (
      <Content>
        <Toolbar />
        {!meetingSections || loading ? (
          <LoadingIndicator loading />
        ) : (
          <MeetingListView
            currentUser={currentUser}
            sections={meetingSections}
          />
        )}
        {showFetchMore && <Button onClick={fetchMore}>Last flere</Button>}
        {showFetchOlder && <Button onClick={fetchOlder}>Hent gamle</Button>}
      </Content>
    );
  }
}
