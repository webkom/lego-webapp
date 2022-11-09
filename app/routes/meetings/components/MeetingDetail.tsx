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
import type { Dateish, ID } from 'app/models';
import { statusesText, statuses } from 'app/reducers/meetingInvitations';
import type {
  MeetingInvitationEntity,
  MeetingInvitationStatus,
} from 'app/reducers/meetingInvitations';
import type { UserEntity } from 'app/reducers/users';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';

type Props = {
  meeting: Record<string, any>;
  currentUser: UserEntity;
  showAnswer: boolean;
  meetingInvitations: Array<MeetingInvitationEntity>;
  setInvitationStatus: (
    meetingId: number,
    status: MeetingInvitationStatus,
    user: UserEntity
  ) => Promise<any>;
  reportAuthor: UserEntity;
  createdBy: UserEntity;
  currentUserInvitation: MeetingInvitationEntity;
  loggedIn: boolean;
  comments: Array<Record<string, any>>;
  push: (arg0: string) => Promise<any>;
  deleteComment: (id: ID, contentTarget: string) => Promise<any>;
};

const UserLink = ({ user }: { user: UserEntity }) =>
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
  acceptInvitation = () => this.setInvitationStatus(statuses.ATTENDING);
  rejectInvitation = () => this.setInvitationStatus(statuses.NOT_ATTENDING);
  sortInvitations = () => {
    const { meetingInvitations } = this.props;
    return Object.keys(statuses).map((invitationStatus) => ({
      name: statusesText[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        (invite) => invite.status === invitationStatus
      ),
    })) as Array<{
      name: string;
      capacity: number;
      registrations: Array<MeetingInvitationEntity>;
    }>;
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
          disabled={statusMe === statuses.ATTENDING}
        >
          Delta
        </Button>
        <Button
          dark
          onClick={this.rejectInvitation}
          disabled={statusMe === statuses.NOT_ATTENDING}
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
