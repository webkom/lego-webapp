// @flow

import React, { Component } from 'react';
import type { Event, Article } from 'app/models';
import type { Element } from 'react';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import { colorForEvent } from 'app/routes/events/utils';
import styles from './OverviewItem.css';

type Props = {
  item: Event | Article,
  url: string,
  meta: Element<'span'> | null
};

class OverviewItem extends Component<Props, *> {
  render() {
    const { item, url, meta } = this.props;
    const TITLE_MAX_LENGTH = 50;
    const DESCRIPTION_MAX_LENGTH = 140;
    return (
      <Flex column className={styles.item}>
        <Flex className={styles.inner}>
          {item.cover && (
            <Flex column>
              <Link to={url} className={styles.imageContainer}>
                <Image className={styles.image} src={item.cover} />
              </Link>
            </Flex>
          )}
          <Flex column className={styles.innerRight}>
            <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.9)' }}>
              <div className={styles.heading}>
                <h2 className={styles.itemTitle}>
                  {truncateString(item.title, TITLE_MAX_LENGTH)}
                </h2>
                {meta}
              </div>
            </Link>

            <p
              className={styles.itemDescription}
              style={{
                borderTop: `3px solid ${colorForEvent(item.eventType)}`
              }}
            >
              {truncateString(item.description, DESCRIPTION_MAX_LENGTH)}
            </p>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default OverviewItem;
