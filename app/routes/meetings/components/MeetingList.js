// @flow

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import Pill from 'app/components/Pill';
import styles from './MeetingList.css';
import LoadingIndicator from 'app/components/LoadingIndicator';


function MeetingListItem({ meeting, userIdMe }) {
  return (
    <div
      style={{ borderColor: 'red' }}
      className={styles.meetingItem}
    >
      <div>
        <Link to={`/meetings/${meeting.id}`}>
          <h3 className={styles.meetingItemTitle}>
            {meeting.title}
            { (userIdMe === meeting.id.reportAuthor) ?
                (
                  <Pill style={{ marginLeft: 10 }}>
                    Eier
                  </Pill>
                ) : ''
            }
          </h3>
        </Link>

        <div>
          <span> TL;DR: Webkom </span>
        </div>

        <div className={styles.meetingTime}>
          <Time
            time={meeting.startTime}
            format='ll HH:mm'
          />
          {` • Lokasjon: ${meeting.location}`}
        </div>
      </div>
      <div className={styles.logo}>
        <img alt='logo' src='https://avatars0.githubusercontent.com/u/674861?v=3&s=200' />
      </div>
    </div>
  );
}

export default class MeetingList extends Component {
  static propTypes = {
    meetings: PropTypes.array.isRequired,
  }

  render() {
    // Meeting sorting
    // -- THIS WEEK --
    // -- NEXT WEEK/MONTH --
    // -- OLD --

    const { meetings } = this.props;
    if (meetings === undefined) {
      return <LoadingIndicator loading />;
    }
    return (
      <div className={styles.root}>
        <h2> Dine møter </h2>

        <h2 className={styles.heading}>Denne uken</h2>
        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}

        <h2 className={styles.heading}>Neste uke</h2>
        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}

        <h2 className={styles.heading}>Tidligere dette semestret</h2>
        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}

        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}

        <h2 className={styles.heading}>V2016</h2>
        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}

        { meetings.map((item, i) => (
          <MeetingListItem key={i} meeting={item} />
        ))}
      </div>
    );
  }
}
