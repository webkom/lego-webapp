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
    return (
      <Flex column className={styles.item}>
        <Flex column>
          {item.cover && (
            <Flex column>
              <Link to={url}>
                <Image className={styles.image} src={item.cover} />
                <p
                  style={{
                    marginTop: '-8px',
                    marginBottom: '-1px',
                    borderTop: `7px solid ${colorForEvent(item.eventType)}`
                  }}
                />
              </Link>
            </Flex>
          )}
          <Flex column>
            <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.9)' }}>
              <div className={styles.heading}>
                <h2 className={styles.itemTitle}>
                  {truncateString(item.title, TITLE_MAX_LENGTH)}
                </h2>
                {meta}
              </div>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default OverviewItem;
