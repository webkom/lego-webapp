import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Icon from 'app/components/Icon';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { AttendanceStatus } from 'app/components/UserAttendance';
import moment from 'moment';


type Props = {
  meeting: object,
  userMe: object
}

function UserLink({ user }) {
  if (user === undefined) {
    return (<span> Ikke valgt </span>);
  }
  return (<Link to={`/users/${user.user.username}`}> {user.user.fullName} </Link>);
}

class MeetingDetails extends Component {
  props: Props;

  setInvitationStatus = (newStatus) => {
    const { meeting, userMe } = this.props;
    this.props.setInvitationStatus(meeting.id, newStatus, userMe.id);
  }


  acceptInvitation = () => {
    this.setInvitationStatus(1);
  }

  rejectInvitation = () => {
    this.setInvitationStatus(2);
  }

  sortInvitations = () => {
    const { invitations } = this.props.meeting;
    const pools = [{
      'name': 'Ikke svart',
      'capacity': invitations.length,
      'registrations': []
    }, {
      'name': 'Deltar',
      'capacity': invitations.length,
      'registrations': []
    }, {
      'name': 'Deltar ikke',
      'capacity': invitations.length,
      'registrations': []
    }];

    invitations.forEach((item) => (pools[item.status].registrations.push(item)));
    return pools.filter((pool) => (pool.registrations.length !== 0));
  }

  attendanceButtons = (statusMe, startTime) => {
    if (moment(startTime) < moment()) {
      return undefined;
    }
    return (
      <li className={styles.statusButtons}>
        <Button onClick={this.acceptInvitation} disabled={statusMe === 1}>
          Delta
        </Button>
        <Button onClick={this.rejectInvitation} disabled={statusMe === 2}>
          Avslå
        </Button>
      </li>
    );
  }

  render() {
    const { meeting, userMe } = this.props;
    const STATUS_MESSAGES = ['Ikke svart', 'Deltar', 'Deltar ikke'];

    if (meeting === undefined || userMe === undefined) {
      return <LoadingIndicator loading />;
    }
    const statusMe = meeting.invitations.filter((item) =>
      (item.user.username === userMe.username))[0].status;

    const reportAuthor = meeting.invitations.filter(
      (invitation) => (invitation.user.id === meeting.reportAuthor))[0];
    const createdBy = meeting.invitations.filter(
      (invitation) => (invitation.user.id === meeting.createdBy))[0];

    return (
      <div className={styles.root}>
        <FlexRow className={styles.heading}>
          <div style={{ flex: 1 }}>
            <h2 className={styles.title}>
              {meeting.title}
            </h2>
            <h3>
              <Time
                style={{ color: 'grey' }}
                time={meeting.startTime}
                format='ll [-] HH:mm'
              />
            </h3>
          </div>

          <Link to={`/meetings/${meeting.id}/edit`}>
            <Button>
              <Icon name='pencil' />
              Endre møte
            </Button>
          </Link>
        </FlexRow>
        <div className={styles.mainContent}>
          <FlexItem className={styles.statusContent} flex={1}>
            <Card>
              <ul>
                <li>
                  <strong> Din status: </strong>
                  {STATUS_MESSAGES[statusMe]}
                </li>
                {this.attendanceButtons(statusMe, meeting.startTime)}
                <li style={{ height: '1px', width: '100%', backgroundColor: '#ccc' }} />
                <li>
                  <strong> Slutt </strong>
                  <Time
                    time={meeting.endTime}
                    format='ll HH:mm'
                  />
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
                  <AttendanceStatus pools={this.sortInvitations()} />
                </li>
              </ul>
            </Card>
          </FlexItem>
          <FlexItem className={styles.reportContent} flex={2}>
            <h2>Referat</h2>
            {/* FIXME proper HTML escape etc. */}
            {meeting.report.split('\n').map((item) => (
              <p>
                {item}
              </p>
            ))}
          </FlexItem>
        </div>

      </div>
    );
  }
}

export default MeetingDetails;
