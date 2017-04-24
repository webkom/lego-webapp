// @flow

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment-timezone';
import config from 'app/config';
import Time from 'app/components/Time';
import Pill from 'app/components/Pill';
import styles from './MeetingList.css';
import Toolbar from './Toolbar';
import LoadingIndicator from 'app/components/LoadingIndicator';

function MeetingListItem({ meeting, userIdMe }) {
  const isDone = moment(meeting.startTime) < moment();
  return (
    <div
      style={{ borderColor: isDone ? 'gray' : 'red' }}
      className={styles.meetingItem}
    >
      <div>
        <Link to={`/meetings/${meeting.id}`}>
          <h3 className={styles.meetingItemTitle}>
            {meeting.title}
            {userIdMe === meeting.createdBy &&
              <Pill style={{ marginLeft: 10 }}>
                Eier
              </Pill>}
            {userIdMe === meeting.reportAuthor &&
              <Pill style={{ marginLeft: 10 }}>
                Referent
              </Pill>}
          </h3>
        </Link>

        <div>
          <span>
            Deltakere:&nbsp;
            {meeting.invitations.filter(invite => invite.status === 1).length}
            {' '}
            av&nbsp;
            {meeting.invitations.length} personer deltar
          </span>
        </div>

        <div className={styles.meetingTime}>
          <Time time={meeting.startTime} format="ll - HH:mm" />
          {` • Lokasjon: ${meeting.location}`}
        </div>
      </div>
    </div>
  );
}

export default class MeetingList extends Component {
  static propTypes = {
    meetings: PropTypes.arrayOf(Object)
  };

  sortMeetings = meetings => {
    const currentYear = moment().year();
    const currentWeek = moment().week();
    const pools = [
      {
        title: 'Denne uken',
        meetings: []
      },
      {
        title: 'Neste uke',
        meetings: []
      },
      {
        title: 'Senere dette semesteret',
        meetings: []
      }
    ];
    const fields = {};

    meetings.forEach(meeting => {
      const startTime = moment.tz(meeting.startTime, config.timezone);
      const year = startTime.year();
      const week = startTime.week();
      const quarter = startTime.quarter();
      if (
        year === currentYear && week === currentWeek && moment() < startTime
      ) {
        pools[0].meetings.push(meeting);
      } else if (year === currentYear && week === currentWeek + 1) {
        pools[1].meetings.push(meeting);
      } else if (year === currentYear && week > currentWeek) {
        pools[2].meetings.push(meeting);
      } else {
        // Sort other meetings with their semester-code. eg V2017
        const title = (Math.ceil(quarter / 2) - 1 ? 'H' : 'V') +
          year.toString();
        fields[title] = fields[title] || { title, meetings: [] };
        fields[title].meetings.push(meeting);
      }
    });

    const oldMeetings = Object.keys(fields)
      .map(key => ({
        title: key,
        meetings: fields[key].meetings
      }))
      .sort((elem1, elem2) => {
        const year1 = elem1.title.substring(1, 5);
        const year2 = elem2.title.substring(1, 5);
        if (year1 === year2) {
          return elem1.title < elem2.tilte ? 1 : -1;
        }
        return year2 - year1;
      });

    return pools
      .concat(oldMeetings)
      .filter(elem => elem.meetings.length)
      .map(pool => ({
        title: pool.title,
        meetings: pool.meetings.sort(
          (elem1, elem2) => moment(elem1.startTime) - moment(elem2.startTime)
        )
      }));
  };

  render() {
    const { meetings, userMe } = this.props;
    if (meetings === undefined) {
      return <LoadingIndicator loading />;
    }
    const pools = this.sortMeetings(meetings);
    const isEmpty = !meetings.length;
    return (
      <div className={styles.root}>
        <Toolbar />

        {pools.map((item, key) => (
          <div key={key}>
            <h2 className={styles.heading}>{item.title}</h2>
            {item.meetings.map((item, key) => (
              <MeetingListItem key={key} userIdMe={userMe.id} meeting={item} />
            ))}
          </div>
        ))}
        {isEmpty &&
          <h2 style={{ textAlign: 'center' }}> Ingen møter å vise</h2>}
      </div>
    );
  }
}
