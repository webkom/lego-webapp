// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import CommentView from 'app/components/Comments/CommentView';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { AttendanceStatus } from 'app/components/UserAttendance';
import moment from 'moment-timezone';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { statusesText, statuses } from 'app/reducers/meetingInvitations';
import DisplayContent from 'app/components/DisplayContent';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentSidebar,
  ContentMain
} from 'app/components/Content';
import type {
  MeetingInvitationEntity,
  MeetingInvitationStatus
} from 'app/reducers/meetingInvitations';
import type { UserEntity } from 'app/reducers/users';
import type { Dateish, ID } from 'app/models';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import { FromToTime } from 'app/components/Time';
import InfoList from 'app/components/InfoList';

type Props = {
  meeting: Object,
  currentUser: UserEntity,
  showAnswer: Boolean,
  meetingInvitations: Array<MeetingInvitationEntity>,
  deleteMeeting: number => Promise<*>,
  setInvitationStatus: (
    meetingId: number,
    status: MeetingInvitationStatus,
    user: UserEntity
  ) => Promise<*>,
  reportAuthor: UserEntity,
  createdBy: UserEntity,
  currentUserInvitation: MeetingInvitationEntity,
  loggedIn: boolean,
  comments: Array<Object>,
  push: string => Promise<*>,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>
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

    return (Object.keys(statuses).map(invitationStatus => ({
      name: statusesText[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        invite => invite.status === invitationStatus
      )
    })): Array<{
      name: string,
      capacity: number,
      registrations: Array<MeetingInvitationEntity>
    }>);
  };

  attendanceButtons = (statusMe: ?string, startTime: Dateish) =>
    statusMe &&
    moment(startTime) > moment() && (
      <li className={styles.statusButtons}>
        <Button
          onClick={this.acceptInvitation}
          disabled={statusMe === statuses.ATTENDING}
        >
          Delta
        </Button>
        <Button
          onClick={this.rejectInvitation}
          disabled={statusMe === statuses.NOT_ATTENDING}
        >
          Avslå
        </Button>
      </li>
    );

  onDeleteMeeting = () =>
    this.props
      .deleteMeeting(this.props.meeting.id)
      .then(() => this.props.push('/meetings/'));

  render() {
    const {
      meeting,
      currentUser,
      reportAuthor,
      createdBy,
      comments,
      loggedIn,
      currentUserInvitation,
      deleteComment
    } = this.props;

    if (!meeting || !currentUser) {
      return <LoadingIndicator loading />;
    }
    const statusMe = currentUserInvitation && currentUserInvitation.status;

    const actionGrant = meeting && meeting.actionGrant;

    const canDelete = actionGrant && actionGrant.includes('delete');
    const canEdit = actionGrant && actionGrant.includes('edit');

    const infoItems = [
      {
        key: 'Din status',
        value: `${statusesText[statusMe]}`
      },
      {
        key: 'Når',
        value: <FromToTime from={meeting.startTime} to={meeting.endTime} />
      },
      {
        key: 'Sted',
        value: `${meeting.location}`
      },
      {
        key: 'Forfatter',
        value: <UserLink user={createdBy} />
      },
      {
        key: 'Referent',
        value: <UserLink user={reportAuthor} />
      }
    ];

    return (
      <div>
        <Content>
          <ContentHeader className={styles.heading}>
            <div style={{ flex: 1 }}>
              <NavigationTab
                title={meeting.title}
                className={styles.detailTitle}
              >
                <NavigationLink to="/meetings">
                  <i className="fa fa-angle-left" /> Mine møter
                </NavigationLink>
                {canEdit && (
                  <NavigationLink to={`/meetings/${meeting.id}/edit`}>
                    Endre møte
                  </NavigationLink>
                )}
                {canDelete && (
                  <ConfirmModalWithParent
                    title="Slett møte"
                    message="Er du sikker på at du vil slette møtet?"
                    onConfirm={this.onDeleteMeeting}
                  >
                    <NavigationLink to="">Slett møte</NavigationLink>
                  </ConfirmModalWithParent>
                )}
              </NavigationTab>
              <h3>
                <Time
                  style={{ color: 'grey' }}
                  time={meeting.startTime}
                  format="ll [-] HH:mm"
                />
              </h3>
            </div>
          </ContentHeader>

          <ContentSection>
            <ContentMain>
              <h2>Referat</h2>
              <DisplayContent content={meeting.report} />
            </ContentMain>
            <ContentSidebar>
              <Card style={{ border: 'none', padding: 0 }} shadow={false}>
                <ul>
                  {this.attendanceButtons(statusMe, meeting.startTime)}
                  <InfoList items={infoItems} />
                  <li>
                    <AttendanceStatus.Modal pools={this.sortInvitations()} />
                  </li>
                  <li>
                    <AnnouncementInLine
                      placeholder="Skriv en kunngjøring til alle inviterte..."
                      meeting={meeting.id}
                      button
                    />
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
