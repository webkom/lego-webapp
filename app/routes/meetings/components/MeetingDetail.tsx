import moment from 'moment-timezone';
import { Component } from 'react';
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
import LoadingIndicator from 'app/components/LoadingIndicator';
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Time, { FromToTime } from 'app/components/Time';
import { AttendanceStatus } from 'app/components/UserAttendance';
import type { Dateish, ID, Meeting, Comment, User } from 'app/models';
import {
  statusesText,
  MeetingInvitationStatus,
} from 'app/reducers/meetingInvitations';
import type { MeetingInvitationEntity } from 'app/reducers/meetingInvitations';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';

type Props = {
  meeting: Meeting;
  currentUser: User;
  showAnswer: boolean;
  meetingInvitations: Array<MeetingInvitationEntity & { id: ID }>;
  setInvitationStatus: (
    meetingId: number,
    status: MeetingInvitationStatus,
    user: User
  ) => Promise<void>;
  reportAuthor: User;
  createdBy: User;
  currentUserInvitation: MeetingInvitationEntity;
  loggedIn: boolean;
  comments: Comment[];
  push: (arg0: string) => Promise<void>;
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
};

const UserLink = ({ user }: { user: User }) =>
  user ? (
    <Link to={`/users/${user.username}`}> {user.fullName} </Link>
  ) : (
    <span> Ikke valgt </span>
  );

class MeetingDetails extends Component<Props> {
  setInvitationStatus = (newStatus: MeetingInvitationStatus) => {
    const { meeting, currentUser } = this.props;
    this.props.setInvitationStatus(meeting.id, newStatus, currentUser);
  };

  acceptInvitation = () =>
    this.setInvitationStatus(MeetingInvitationStatus.ATTENDING);

  rejectInvitation = () =>
    this.setInvitationStatus(MeetingInvitationStatus.NOT_ATTENDING);

  sortInvitations = () => {
    const { meetingInvitations } = this.props;
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

  attendanceButtons = (
    statusMe: string | null | undefined,
    startTime: Dateish
  ) =>
    statusMe &&
    moment(startTime) > moment() && (
      <li className={styles.statusButtons}>
        <Button
          success
          onClick={this.acceptInvitation}
          disabled={statusMe === MeetingInvitationStatus.ATTENDING}
        >
          Delta
        </Button>
        <Button
          dark
          onClick={this.rejectInvitation}
          disabled={statusMe === MeetingInvitationStatus.NOT_ATTENDING}
        >
          Avslå
        </Button>
      </li>
    );

  render() {
    const {
      meeting,
      currentUser,
      reportAuthor,
      createdBy,
      comments,
      loggedIn,
      currentUserInvitation,
      deleteComment,
    } = this.props;

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
              label: 'Mine møter',
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
                  {this.attendanceButtons(statusMe, meeting.startTime)}
                  <InfoList items={infoItems} />
                  <li>
                    <AttendanceStatus.Modal pools={this.sortInvitations()} />
                  </li>
                  {meeting.mazemapPoi && (
                    <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
                  )}
                  <li>
                    <AnnouncementInLine meeting={meeting} />
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
  }
}

export default MeetingDetails;
