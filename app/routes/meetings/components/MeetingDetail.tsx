import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import CommentView from 'app/components/Comments/CommentView';
import {
  Content,
  ContentSection,
  ContentSidebar,
  ContentMain,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import InfoList from 'app/components/InfoList';
import LegoReactions from 'app/components/LegoReactions';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Time, { FromToTime } from 'app/components/Time';
import {
  AttendanceStatus,
  ModalParentComponent,
} from 'app/components/UserAttendance';
import type { Dateish, ID } from 'app/models';
import type { MeetingInvitationWithUser } from 'app/reducers/meetingInvitations';
import { statusesText } from 'app/reducers/meetingInvitations';
import type Comment from 'app/store/models/Comment';
import type Emoji from 'app/store/models/Emoji';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { CurrentUser, PublicUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';

type Props = {
  meeting: DetailedMeeting;
  currentUser: CurrentUser;
  showAnswer: boolean;
  meetingInvitations: MeetingInvitationWithUser[];
  setInvitationStatus: (
    meetingId: number,
    status: MeetingInvitationStatus,
    user: CurrentUser
  ) => Promise<void>;
  reportAuthor: PublicUser;
  createdBy: PublicUser;
  currentUserInvitation: MeetingInvitationWithUser;
  loggedIn: boolean;
  comments: Comment[];
  deleteComment: (id: ID, contentTarget: ContentTarget) => Promise<void>;
  emojis: Emoji[];
  addReaction: (args: {
    emoji: string;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  reactionsGrouped: ReactionsGrouped[];
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
};

const UserLink = ({ user }: { user: PublicUser }) =>
  user ? (
    <Link to={`/users/${user.username}`}> {user.fullName} </Link>
  ) : (
    <span> Ikke valgt </span>
  );

const MeetingDetails = ({
  meeting,
  currentUser,
  reportAuthor,
  createdBy,
  comments,
  loggedIn,
  currentUserInvitation,
  deleteComment,
  emojis,
  addReaction,
  deleteReaction,
  fetchEmojis,
  fetchingEmojis,
  setInvitationStatus,
  meetingInvitations,
}: Props) => {
  const setMeetingInvitationStatus = (newStatus: MeetingInvitationStatus) => {
    setInvitationStatus(meeting.id, newStatus, currentUser);
  };

  const acceptInvitation = () =>
    setMeetingInvitationStatus(MeetingInvitationStatus.Attending);

  const rejectInvitation = () =>
    setMeetingInvitationStatus(MeetingInvitationStatus.NotAttending);

  const sortInvitations = () => {
    return Object.values(MeetingInvitationStatus).map((invitationStatus) => ({
      name: statusesText[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        (invite) => invite.status === invitationStatus
      ),
    }));
  };

  const attendanceButtons = (
    statusMe: string | null | undefined,
    startTime: Dateish
  ) =>
    statusMe &&
    moment(startTime) > moment() && (
      <li className={styles.statusButtons}>
        <Button
          success
          onClick={acceptInvitation}
          disabled={statusMe === MeetingInvitationStatus.Attending}
        >
          Delta
        </Button>
        <Button
          dark
          onClick={rejectInvitation}
          disabled={statusMe === MeetingInvitationStatus.NotAttending}
        >
          Avslå
        </Button>
      </li>
    );

  if (!meeting || !currentUser) {
    return <LoadingIndicator loading />;
  }

  const statusMe = currentUserInvitation?.status;
  const actionGrant = meeting?.actionGrant;
  const canEdit = actionGrant?.includes('edit');
  const infoItems = [
    {
      key: 'Din status',
      value: `${statusesText[statusMe]}`,
    },
    {
      key: 'Når',
      value: <FromToTime from={meeting.startTime} to={meeting.endTime} />,
    },
    {
      key: 'Sted',
      value: `${meeting.location}`,
    },
    {
      key: 'Forfatter',
      value: <UserLink user={createdBy} />,
    },
    {
      key: 'Referent',
      value: <UserLink user={reportAuthor} />,
    },
  ];
  return (
    <Content>
      <Helmet title={meeting.title} />
      <NavigationTab
        title={meeting.title}
        className={styles.detailTitle}
        details={
          <Time
            style={{
              color: 'grey',
            }}
            time={meeting.startTime}
            format="ll [-] HH:mm"
          />
        }
        back={{
          label: 'Dine møter',
          path: '/meetings',
        }}
      >
        {canEdit && (
          <NavigationLink to={`/meetings/${meeting.id}/edit`}>
            Rediger
          </NavigationLink>
        )}
      </NavigationTab>

      <ContentSection>
        <ContentMain>
          {meeting.description && (
            <div>{urlifyString(meeting.description)}</div>
          )}
          <h2>Referat</h2>
          <DisplayContent content={meeting.report} />
        </ContentMain>
        <ContentSidebar>
          <Card
            style={{
              border: 'none',
              padding: 0,
            }}
            shadow={false}
          >
            <ul>
              {attendanceButtons(statusMe, meeting.startTime)}
              <InfoList items={infoItems} />
              <li>
                <ModalParentComponent
                  isMeeting
                  key="modal"
                  pools={sortInvitations()}
                  title="Påmeldte"
                >
                  <AttendanceStatus pools={sortInvitations()} />
                </ModalParentComponent>
              </li>
              {meeting.mazemapPoi && (
                <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
              )}
              <li>
                <AnnouncementInLine meeting={meeting} />
              </li>
              <li>
                {meeting.contentTarget && (
                  <div className={styles.meetingReactions}>
                    <LegoReactions
                      emojis={emojis}
                      fetchEmojis={fetchEmojis}
                      fetchingEmojis={fetchingEmojis}
                      addReaction={addReaction}
                      deleteReaction={deleteReaction}
                      parentEntity={meeting}
                      loggedIn={loggedIn}
                    />
                  </div>
                )}
              </li>
            </ul>
          </Card>
        </ContentSidebar>
      </ContentSection>
      <ContentSection>
        <ContentMain>
          {meeting.contentTarget && (
            <CommentView
              user={currentUser}
              contentTarget={meeting.contentTarget}
              loggedIn={loggedIn}
              comments={comments}
              deleteComment={deleteComment}
            />
          )}
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default MeetingDetails;
