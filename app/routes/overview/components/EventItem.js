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

    // This value will less then 0 if activationTime has yet to come
    const future = moment().diff(activationTime) < 0;
    const info = future
      ? `Åpner ${moment(activationTime).format('dddd D MMM HH:mm')}`
      : totalCapacity == 0
      ? 'Åpent arrangement'
      : `${registrationCount}/${totalCapacity}`;

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
