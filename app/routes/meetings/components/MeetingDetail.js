// @flow

import React, { Component } from 'react';
import Time from 'app/components/Time';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import styles from './MeetingDetail.css';
import Card from 'app/components/Card';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import AttendanceStatus from './AttendanceStatus';


class MeetingDetails extends Component {

  setInvitationStatus = (newStatus) => {
    const { meeting, userMe } = this.props;

    this.props.setInvitationStatus(meeting.id, newStatus, userMe.id);
  }
  props: Props;

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

  render() {
    const { meeting, userMe } = this.props;
    const STATUS_MESSAGES = ['Ikke svart', 'Deltar', 'Deltar ikke'];

    if (meeting === undefined || userMe === undefined) {
      return <LoadingIndicator loading />;
    }
    const statusMe = meeting.invitations.filter((item) =>
        (item.user.username === userMe.username))[0].status;

    return (
      <div className={styles.root}>
        <FlexRow className={styles.header}>
          <h2>
            {meeting.title}
            <span> - </span>
            <Time
              time={meeting.startTime}
              format='ll'
            />
          </h2>
        </FlexRow>
        <FlexRow style={{ padding: 20 }}>
          <FlexItem flex={1}>
            <Card>
              <ul>
                <li>
                  <strong> Din status: </strong>
                  {STATUS_MESSAGES[statusMe]}
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button onClick={this.acceptInvitation} disabled={statusMe === 1}>
                    Delta
                  </Button>
                  <Button onClick={this.rejectInvitation} disabled={statusMe === 2}>
                    Avslå
                  </Button>
                </li>
                <li style={{ height: '1px', width: '100%', backgroundColor: '#ccc' }} />
                <li>
                  <strong> Tidspunkt </strong>
                  <Time
                    time={meeting.startTime}
                    format='HH:mm'
                  />
                </li>
                <li>
                  <strong> Dato </strong>
                  <Time
                    time={meeting.startTime}
                    format='ll'
                  />
                </li>
                <li>
                  <strong> Forfatter </strong>
                  Webkom Webkom
                </li>
                <li>
                  <AttendanceStatus pools={this.sortInvitations()} />
                </li>
              </ul>
            </Card>
          </FlexItem>

          <FlexItem flex={2}>
            <div style={{ padding: 20 }}>
              <h2>Referat</h2>
              {meeting.report}
              {meeting.report}
            </div>

          </FlexItem>
        </FlexRow>

      </div>
    );
  }
}

export default MeetingDetails;
