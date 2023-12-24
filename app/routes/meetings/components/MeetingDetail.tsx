import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom-v5-compat';
import { setInvitationStatus } from 'app/actions/MeetingActions';
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
import {
  selectMeetingInvitation,
  selectMeetingInvitationsForMeeting,
  statusesText,
} from 'app/reducers/meetingInvitations';
import {
  selectCommentsForMeeting,
  selectMeetingById,
} from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';
import type { Dateish } from 'app/models';
import type { PublicUser } from 'app/store/models/User';

const UserLink = ({ user }: { user: PublicUser }) =>
  user && !isEmpty(user) ? (
    <Link to={`/users/${user.username}`}>{user.fullName}</Link>
  ) : (
    <span>Ikke valgt</span>
  );

const MeetingDetails = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { currentUser, loggedIn } = useUserContext();
  const meeting = useAppSelector((state) =>
    selectMeetingById(state, {
      meetingId,
    })
  );
  const comments = useAppSelector((state) =>
    selectCommentsForMeeting(state, {
      meetingId,
    })
  );
  const reportAuthor = useAppSelector((state) =>
    selectUserById(state, {
      userId: meeting?.reportAuthor,
    })
  );
  const createdBy = useAppSelector((state) =>
    selectUserById(state, {
      userId: meeting?.createdBy,
    })
  );
  const meetingInvitations = useAppSelector((state) =>
    selectMeetingInvitationsForMeeting(state, {
      meetingId,
    })
  );
  const currentUserInvitation = useAppSelector((state) =>
    selectMeetingInvitation(state, {
      userId: currentUser.username,
      meetingId,
    })
  );

  const dispatch = useAppDispatch();

  const setMeetingInvitationStatus = (newStatus: MeetingInvitationStatus) => {
    dispatch(setInvitationStatus(meeting.id, newStatus, currentUser));
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
