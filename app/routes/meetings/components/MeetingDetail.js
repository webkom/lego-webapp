import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Icon from 'app/components/Icon';
import Button from 'app/components/Button';
import Editor from 'app/components/Editor';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { AttendanceStatus } from 'app/components/UserAttendance';
import moment from 'moment';
import { INVITATION_STATUSES_TEXT, INVITATION_STATUSES } from '../constants';

type Props = {
  meeting: object,
  user: object,
  showAnswer: Boolean
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
    this.props.setInvitationStatus(meeting.id, newStatus, user.id);
  };

  acceptInvitation = () =>
    this.setInvitationStatus(INVITATION_STATUSES.ATTENDING);

  rejectInvitation = () =>
    this.setInvitationStatus(INVITATION_STATUSES.NOT_ATTENDING);

  sortInvitations = () => {
    const { invitations } = this.props.meeting;

    return Object.keys(INVITATION_STATUSES).map(invitationStatus => ({
      name: INVITATION_STATUSES_TEXT[invitationStatus],
      capacity: invitations.length,
      registrations: invitations.filter(
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

  render() {
    const { meeting, user, showAnswer } = this.props;

    if (!meeting || !user) {
      return <LoadingIndicator loading />;
    }
    const statusMe = meeting.invitations.find(
      item => item.user.username === user.username
    ).status;

    const reportAuthorInvite = meeting.invitations.find(
      invite => invite.user.id === meeting.reportAuthor
    );
    const reportAuthor = reportAuthorInvite ? reportAuthorInvite.user : null;

    const createdBy = meeting.invitations.find(
      invite => invite.user.id === meeting.createdBy
    ).user;

    const canDelete = user.id === meeting.createdBy;
    return (
      <div className={styles.root}>
        {showAnswer && <h2> Du har nå svart på invitasjonen 😃 </h2>}
        <h2>
          <Link to="/meetings/">
            <i className="fa fa-angle-left" /> Mine møter
          </Link>
        </h2>
        <FlexRow className={styles.heading}>
          <div style={{ flex: 1 }}>
            <h1 className={styles.title}>{meeting.title}</h1>
            <h3>
              <Time
                style={{ color: 'grey' }}
                time={meeting.startTime}
                format="ll [-] HH:mm"
              />
            </h3>
          </div>

          <div>
            <Link to={`/meetings/${meeting.id}/edit`}>
              <Button>
                <Icon name="pencil" />
                Endre møte
              </Button>
            </Link>

            {canDelete && (
              <Button
                style={{ backgroundColor: 'pink' }}
                onClick={() => {
                  this.props.deleteMeeting(meeting.id);
                }}
              >
                <Icon name="trash" />
                Slett møte
              </Button>
            )}
          </div>
        </FlexRow>
        <div className={styles.mainContent}>
          <FlexItem className={styles.statusContent} flex={1}>
            <Card>
              <ul>
                <li>
                  <strong> Din status: </strong>
                  {INVITATION_STATUSES_TEXT[statusMe]}
                </li>
                {this.attendanceButtons(statusMe, meeting.startTime)}
                <li
                  style={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: '#ccc'
                  }}
                />
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
          <FlexItem className={styles.reportContent} flex={2}>
            <h2>Referat</h2>
            <Editor readOnly value={meeting.report} />
          </FlexItem>
        </div>
      </div>
    );
  }
}
export default MeetingDetails;
