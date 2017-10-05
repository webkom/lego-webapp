import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Button from 'app/components/Button';
import Editor from 'app/components/Editor';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { AttendanceStatus } from 'app/components/UserAttendance';
import moment from 'moment';
import { INVITATION_STATUSES_TEXT, INVITATION_STATUSES } from '../constants';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { MeetingInvitationEntity } from 'app/reducers/meetingInvitation';

type Props = {
  meeting: object,
  user: object,
  showAnswer: Boolean,
  meetingInvitations: Array<MeetingInvitationEntity>
};

const UserLink = ({ user }: object) =>
  user ? (
    <Link to={`/users/${user.username}`}> {user.fullName} </Link>
  ) : (
    <span> Ikke valgt </span>
  );

class MeetingDetails extends Component {
  props: Props;

  setInvitationStatus = newStatus => {
    const { meeting, user } = this.props;
    this.props.setInvitationStatus(meeting.id, newStatus, user);
  };

  acceptInvitation = () =>
    this.setInvitationStatus(INVITATION_STATUSES.ATTENDING);

  rejectInvitation = () =>
    this.setInvitationStatus(INVITATION_STATUSES.NOT_ATTENDING);

  sortInvitations = () => {
    const { meetingInvitations } = this.props;

    return Object.keys(INVITATION_STATUSES).map(invitationStatus => ({
      name: INVITATION_STATUSES_TEXT[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        invite => invite.status === invitationStatus
      )
    }));
  };

  attendanceButtons = (statusMe, startTime) =>
    moment(startTime) > moment() && (
      <li className={styles.statusButtons}>
        <Button
          onClick={this.acceptInvitation}
          disabled={statusMe === INVITATION_STATUSES.ATTENDING}
        >
          Delta
        </Button>
        <Button
          onClick={this.rejectInvitation}
          disabled={statusMe === INVITATION_STATUSES.NOT_ATTENDING}
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
      user,
      showAnswer,
      reportAuthor,
      createdBy,
      currentUserInvitation
    } = this.props;

    if (!meeting || !user) {
      return <LoadingIndicator loading />;
    }
    const statusMe = currentUserInvitation && currentUserInvitation.status;

    const canDelete = meeting.actionGrant.includes('delete');
    const canEdit = meeting.actionGrant.includes('edit');

    return (
      <div className={styles.root}>
        {showAnswer && <h2> Du har nå svart på invitasjonen 😃 </h2>}

        <FlexRow className={styles.heading}>
          <div style={{ flex: 1 }}>
            <NavigationTab title={meeting.title} className={styles.detailTitle}>
              <NavigationLink to="/meetings">
                <i className="fa fa-angle-left" /> Mine møter
              </NavigationLink>
              <NavigationLink to={`/meetings/${meeting.id}/edit`}>
                Endre møte
              </NavigationLink>
              {canDelete && (
                <NavigationLink
                  onClick={() => {
                    this.props.deleteMeeting(meeting.id);
                  }}
                >
                  Slett møte
                </NavigationLink>
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
            <Editor readOnly value={meeting.report} />
          </FlexItem>
          <FlexItem className={styles.statusContent} flex={1}>
            <Card style={{ border: 'none', padding: 0 }} shadow={false}>
              <ul>
                {this.attendanceButtons(statusMe, meeting.startTime)}
                <li>
                  <strong> Din status: </strong>
                  {INVITATION_STATUSES_TEXT[statusMe]}
                </li>
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
