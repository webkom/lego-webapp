import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
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
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import NavigationTab from 'app/components/NavigationTab';
import Time, { FromToTime } from 'app/components/Time';
import { AttendanceStatus } from 'app/components/UserAttendance';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import { statusesText } from 'app/reducers/meetingInvitations';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';
import type { Dateish, ID } from 'app/models';
import type { MeetingInvitationWithUser } from 'app/reducers/meetingInvitations';
import type Comment from 'app/store/models/Comment';
import type Emoji from 'app/store/models/Emoji';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { CurrentUser, PublicUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

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
    user: CurrentUser;
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
  user && !isEmpty(user) ? (
    <Link to={`/users/${user.username}`}>{user.fullName}</Link>
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
      value: statusesText[statusMe] || 'Ukjent',
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
      ></NavigationTab>

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
                <AttendanceModal
                  isMeeting
                  key="modal"
                  pools={sortInvitations()}
                  title="Påmeldte"
                >
                  {({ toggleModal }) => (
                    <AttendanceStatus
                      toggleModal={toggleModal}
                      pools={sortInvitations()}
                    />
                  )}
                </AttendanceModal>
              </li>
              {meeting.mazemapPoi && (
                <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
              )}
            </ul>

            <Flex column gap={7}>
              <h3>Admin</h3>

              <AnnouncementInLine meeting={meeting} />
              {canEdit && (
                <Link to={`/meetings/${meeting.id}/edit`}>
                  <Button>
                    <Icon name="create-outline" size={19} />
                    Rediger
                  </Button>
                </Link>
              )}
            </Flex>
          </Card>
        </ContentSidebar>
      </ContentSection>
      <ContentSection>
        <ContentMain>
          {meeting.contentTarget && (
            <>
              <div className={styles.meetingReactions}>
                <LegoReactions
                  emojis={emojis}
                  fetchEmojis={fetchEmojis}
                  fetchingEmojis={fetchingEmojis}
                  user={currentUser}
                  addReaction={addReaction}
                  deleteReaction={deleteReaction}
                  parentEntity={meeting}
                  loggedIn={loggedIn}
                />
              </div>
              <CommentView
                user={currentUser}
                contentTarget={meeting.contentTarget}
                loggedIn={loggedIn}
                comments={comments}
                deleteComment={deleteComment}
                contentAuthors={meeting.createdBy}
              />
            </>
          )}
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default MeetingDetails;
