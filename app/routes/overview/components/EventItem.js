// @flow

import React, { Component } from 'react';
import type { Event, Article } from 'app/models';
import type { Element } from 'react';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Link } from 'react-router';
import { Flex } from 'app/components/Layout';
import { colorForEvent } from 'app/routes/events/utils';
import styles from './EventItem.css';
import moment from 'moment-timezone';

type Props = {
  item: Event | Article,
  url: string,
  meta: Element<'span'> | null
};

class EventItem extends Component<Props, *> {
  render() {
    const { item, url, meta } = this.props;
    const TITLE_MAX_LENGTH = 50;
    const { registrationCount, totalCapacity, activationTime } = item;

    /* The event tooltip is calculated based on different factors.
     *
     * 1) The event is yet to announced, meaning nobody has created
     * a pool for the event and the location is set to TBA.
     *
     * 2) The event has no pool because no pool is needed for this
     * event. These events will show up as 'Åpent arrangement' if
     * they have their location set to something else then 'TBA'
     *
     * 3) The event is yet to open. This event will have the
     * activationTime set to something else then 'null'
     *
     * 4) The event is open. Here activation time will be 'null' again
     * and we show how many has signed up for the event.
     *
     * 5) The user has signed up for the event. This should also
     * show how many users have signed up for the event.
     *
     */

    const tba =
      activationTime == null &&
      !totalCapacity &&
      !registrationCount &&
      item.location.toLowerCase() == 'tba';

    const future = moment().isBefore(activationTime);

    const info = tba
      ? 'TBA'
      : future
      ? `Åpner ${moment(activationTime).format('dddd D MMM HH:mm')}`
      : totalCapacity == 0
      ? 'Åpent arrangement'
      : `${registrationCount}/${totalCapacity} påmeldte`;

    return (
      <div className={styles.body}>
        <Link to={url} className={styles.link}>
          <Flex className={styles.wrapper}>
            <Flex column className={styles.left}>
              {item.cover && (
                <Image className={styles.image} src={item.cover} />
              )}
              <span className={styles.info}>{info}</span>
            </Flex>
            <div
              className={styles.right}
              style={{
                borderBottom: `4px solid ${colorForEvent(item.eventType)}`
              }}
            >
              <h2 className={styles.itemTitle}>
                {truncateString(item.title, TITLE_MAX_LENGTH)}
              </h2>
              {meta}
            </div>
          </Flex>
        </Link>
      </div>
    );
  }
}

export default EventItem;
