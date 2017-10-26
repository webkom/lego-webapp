// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Button from 'app/components/Button';
import DisplayContent from 'app/components/DisplayContent';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { AttendanceStatus } from 'app/components/UserAttendance';
import moment from 'moment-timezone';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { statusesText, statuses } from 'app/reducers/meetingInvitations';

import type {
  MeetingInvitationEntity,
  MeetingInvitationStatus
} from 'app/reducers/meetingInvitations';
import type { UserEntity } from 'app/reducers/users';
import type { Dateish } from 'app/models';

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
  push: string => Promise<*>
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

    return Object.keys(statuses).map(invitationStatus => ({
      name: statusesText[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        invite => invite.status === invitationStatus
      )
    }));
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

  onDeleteMeeting = () => {
    this.props
      .deleteMeeting(this.props.meeting.id)
      .then(() => this.props.push('/meetings/'));
  };

  render() {
    const {
      meeting,
      currentUser,
      showAnswer,
      reportAuthor,
      createdBy,
      currentUserInvitation
    } = this.props;

    if (!meeting || !currentUser) {
      return <LoadingIndicator loading />;
    }
    const statusMe = currentUserInvitation && currentUserInvitation.status;

    const actionGrant = meeting && meeting.actionGrant;

    const canDelete = actionGrant && actionGrant.includes('delete');
    const canEdit = actionGrant && actionGrant.includes('edit');

    return (
      <div className={styles.root}>
        {showAnswer && (
          <h2>
            {' '}
            Du har nå svart på invitasjonen{' '}
            <span aria-label="smile" role="img">
              😃
            </span>{' '}
          </h2>
        )}

        <FlexRow className={styles.heading}>
          <div style={{ flex: 1 }}>
            <NavigationTab title={meeting.title} className={styles.detailTitle}>
              <NavigationLink to="/meetings">
                <i className="fa fa-angle-left" /> Mine møter
              </NavigationLink>
              {canEdit && (
                <NavigationLink to={`/meetings/${meeting.id}/edit`}>
                  Endre møte
                </NavigationLink>
              )}
              {canDelete && (
                /* $FlowFixMe what is wrong with confirmomdalwithparent */
                <ConfirmModalWithParent
                  title="Slett møte"
                  message="Er du sikker på at du vil slette møtet?"
                  onConfirm={this.onDeleteMeeting}
                >
                  <div>
                    <NavigationLink to="">Slett møte</NavigationLink>
                  </div>
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
        </FlexRow>
        <div className={styles.mainContent}>
          <FlexItem className={styles.reportContent} flex={2}>
            <h2>Referat</h2>
            <DisplayContent content={meeting.report} />
          </FlexItem>
          <FlexItem className={styles.statusContent} flex={1}>
            <Card style={{ border: 'none', padding: 0 }} shadow={false}>
              <ul>
                {this.attendanceButtons(statusMe, meeting.startTime)}
                {statusMe && (
                  <li>
                    <strong> Din status: </strong>
                    {statusesText[statusMe]}
                  </li>
                )}
                <li>
                  <strong> Slutt </strong>
                  <Time time={meeting.endTime} format="ll HH:mm" />
                </li>
                <li>
                  <strong> Lokasjon: </strong>
                  <span> {meeting.location} </span>
                </li>
                <li>
                  <strong> Forfatter: </strong>
                  <UserLink user={createdBy} />
                </li>

                <li>
                  <strong> Referent: </strong>
                  <UserLink user={reportAuthor} />
                </li>
                <li>
                  <AttendanceStatus.Modal pools={this.sortInvitations()} />
                </li>
              </ul>
            </Card>
          </FlexItem>
        </div>
      </div>
    );
  }
}

export default MeetingDetails;
