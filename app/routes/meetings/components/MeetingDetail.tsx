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
import type { Dateish, ID, Meeting, User } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import {
  statusesText,
  MeetingInvitationStatus,
} from 'app/reducers/meetingInvitations';
import type { MeetingInvitationEntity } from 'app/reducers/meetingInvitations';
import type { ReactionEntity } from 'app/reducers/reactions';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';

type Props = {
  meeting: Meeting;
  currentUser: CurrentUser;
  showAnswer: boolean;
  meetingInvitations: Array<MeetingInvitationEntity & { id: ID }>;
  setInvitationStatus: (
    meetingId: number,
    status: MeetingInvitationStatus,
    user: CurrentUser
  ) => Promise<void>;
  reportAuthor: User;
  createdBy: User;
  currentUserInvitation: MeetingInvitationEntity;
  loggedIn: boolean;
  comments: Comment[];
  push: (arg0: string) => Promise<void>;
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
  emojis: Array<EmojiEntity>;
  addReaction: (arg0: {
    emoji: string;
    contentTarget: string;
  }) => Promise<unknown>;
  reactionsGrouped: Array<ReactionEntity>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
};

const UserLink = ({ user }: { user: User }) =>
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
    setMeetingInvitationStatus(MeetingInvitationStatus.ATTENDING);

  const rejectInvitation = () =>
    setMeetingInvitationStatus(MeetingInvitationStatus.NOT_ATTENDING);

  const sortInvitations = () => {
    return (
      Object.keys(MeetingInvitationStatus) as Array<
        keyof typeof MeetingInvitationStatus
      >
    ).map((invitationStatus) => ({
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
          disabled={statusMe === MeetingInvitationStatus.ATTENDING}
        >
          Delta
        </Button>
        <Button
          dark
          onClick={rejectInvitation}
          disabled={statusMe === MeetingInvitationStatus.NOT_ATTENDING}
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
    <div>
      <Helmet title={meeting.title} />
      <Content>
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
    </div>
  );
};

export default MeetingDetails;
