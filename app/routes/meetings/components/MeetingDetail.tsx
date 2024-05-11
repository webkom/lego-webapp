import {
  Button,
  Flex,
  Icon,
  LinkButton,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { setInvitationStatus } from 'app/actions/MeetingActions';
import AddToCalendar from 'app/components/AddToCalendar/AddToCalendar';
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
import Attendance from 'app/components/UserAttendance/Attendance';
import { useCurrentUser } from 'app/reducers/auth';
import { selectCommentsByIds } from 'app/reducers/comments';
import {
  selectMeetingInvitationByMeetingIdAndUserId,
  selectMeetingInvitationsForMeeting,
  statusesText,
} from 'app/reducers/meetingInvitations';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';
import type { Dateish } from 'app/models';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import type { PublicUser } from 'app/store/models/User';

const UserLink = ({ user }: { user?: PublicUser }) =>
  user && !isEmpty(user) ? (
    <Link to={`/users/${user.username}`}>{user.fullName}</Link>
  ) : (
    <span>Ikke valgt</span>
  );

type MeetingDetailParams = {
  meetingId: string;
};

const MeetingDetails = () => {
  const { meetingId } = useParams<MeetingDetailParams>() as MeetingDetailParams;
  const currentUser = useCurrentUser();
  const icalToken = currentUser?.icalToken;
  const meeting = useAppSelector((state) =>
    selectMeetingById<DetailedMeeting>(state, meetingId),
  );
  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, meeting?.comments),
  );
  const reportAuthor = useAppSelector((state) =>
    selectUserById<PublicUser>(state, meeting?.reportAuthor),
  );
  const createdBy = useAppSelector((state) =>
    selectUserById<PublicUser>(state, meeting?.createdBy),
  );
  const meetingInvitations = useAppSelector((state) =>
    selectMeetingInvitationsForMeeting(state, meetingId),
  );
  const currentUserInvitation = useAppSelector(
    (state) =>
      currentUser &&
      selectMeetingInvitationByMeetingIdAndUserId(
        state,
        meetingId,
        currentUser.id,
      ),
  );

  const dispatch = useAppDispatch();

  const setMeetingInvitationStatus = (newStatus: MeetingInvitationStatus) => {
    currentUser &&
      meeting?.id &&
      dispatch(setInvitationStatus(meeting?.id, newStatus, currentUser));
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
        (invite) => invite.status === invitationStatus,
      ),
    }));
  };

  const attendanceButtons = (
    statusMe: string | null | undefined,
    startTime: Dateish,
  ) =>
    statusMe &&
    moment(startTime) > moment() && (
      <li className={styles.statusButtons}>
        <Button
          success
          onPress={acceptInvitation}
          disabled={statusMe === MeetingInvitationStatus.Attending}
        >
          Delta
        </Button>
        <Button
          dark
          onPress={rejectInvitation}
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
      value: statusMe ? statusesText[statusMe] : 'Ukjent',
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
          <ul>
            {attendanceButtons(statusMe, meeting.startTime)}
            <InfoList items={infoItems} />
            <Attendance isMeeting pools={sortInvitations()} />
            {meeting.mazemapPoi && (
              <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
            )}

            {icalToken && (
              <li>
                <AddToCalendar icalToken={icalToken} meeting={meeting} />
              </li>
            )}
          </ul>

          <Flex column gap={7}>
            <h3>Admin</h3>

            <AnnouncementInLine meeting={meeting} />
            {canEdit && (
              <LinkButton href={`/meetings/${meeting.id}/edit`}>
                <Icon name="create-outline" size={19} />
                Rediger
              </LinkButton>
            )}
          </Flex>
        </ContentSidebar>
      </ContentSection>
      <ContentSection>
        <ContentMain>
          {meeting.contentTarget && (
            <>
              <div className={styles.meetingReactions}>
                <LegoReactions parentEntity={meeting} showPeople />
              </div>
              <CommentView
                contentTarget={meeting.contentTarget}
                comments={comments}
                contentAuthors={meeting.createdBy}
              />
            </>
          )}
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default guardLogin(MeetingDetails);
