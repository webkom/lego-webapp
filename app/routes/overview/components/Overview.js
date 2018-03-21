// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Container, Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import LatestReadme from './LatestReadme';
import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING, colorForEvent } from 'app/routes/events/utils';
import Button from 'app/components/Button';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 140;
const IMAGE_HEIGHT = 192;

const itemUrl = item => `/${item.eventType ? 'events' : 'articles'}/${item.id}`;

const renderMeta = item => {
  switch (item.documentType) {
    case 'article': {
      return (
        <span className={styles.itemInfo}>
          {item.createdAt && (
            <Time time={item.createdAt} format="DD.MM HH:mm" />
          )}
          {item.location &&
            item.location !== '-' && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{item.location}</span>
              </span>
            )}
          <span>
            <span className={styles.dot}> · </span>
            <span>Artikkel</span>
          </span>
          {item.tags &&
            item.tags.length > 0 && (
              <span>
                <span className={styles.dot}> · </span>
                <Tags className={styles.tagline}>
                  {item.tags
                    .slice(0, 3)
                    .map(tag => (
                      <Tag className={styles.tag} tag={tag} key={tag} />
                    ))}
                </Tags>
              </span>
            )}
        </span>
      );
    }
    case 'event': {
      return (
        <span className={styles.itemInfo}>
          {item.startTime && (
            <Time time={item.startTime} format="DD.MM HH:mm" />
          )}
          {item.location &&
            item.location !== '-' && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{item.location}</span>
              </span>
            )}
          {item.eventType && (
            <span>
              <span className={styles.dot}> · </span>
              <span>{EVENT_TYPE_TO_STRING(item.eventType)}</span>
            </span>
          )}
          {item.tags &&
            item.tags.length > 0 && (
              <span>
                <span className={styles.dot}> · </span>
                <Tags className={styles.tagline}>
                  {item.tags
                    .slice(0, 3)
                    .map(tag => (
                      <Tag className={styles.tag} tag={tag} key={tag} />
                    ))}
                </Tags>
              </span>
            )}
        </span>
      );
    }
    default:
      return null;
  }
};

function PrimaryItem({
  item
}: {
  item: (Event | Article) & { documentType: string }
}) {
  return (
    <Flex column className={styles.primaryItem}>
      <h2 className="u-ui-heading">Festet oppslag</h2>
      <Flex column className={styles.innerPrimaryItem}>
        <Link
          to={itemUrl(item)}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image className={styles.image} src={item.cover} />
        </Link>
        <div className={styles.pinnedHeading}>
          <h2 className={styles.itemTitle}>
            <Link to={itemUrl(item)}>{item.title}</Link>
          </h2>
          {renderMeta(item)}
        </div>
      </Flex>
    </Flex>
  );
}

const OverviewItem = ({
  item
}: {
  item: (Event | Article) & { documentType: string }
}) => {
  return (
    <Flex column className={styles.item}>
      <Flex className={styles.inner}>
        {item.cover && (
          <Flex column>
            <Link to={itemUrl(item)} className={styles.imageContainer}>
              <Image className={styles.image} src={item.cover} />
            </Link>
          </Flex>
        )}
        <Flex column className={styles.innerRight}>
          <Link to={itemUrl(item)} style={{ color: 'rgba(0, 0, 0, 0.9)' }}>
            <div className={styles.heading}>
              <h2 className={styles.itemTitle}>
                {truncateString(item.title, TITLE_MAX_LENGTH)}
              </h2>
              {renderMeta(item)}
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
};

type Props = {
  frontpage: Array<Object>,
  feed: Object,
  feedItems: Array<Object>,
  loadingFrontpage: boolean
};

type State = {
  eventsToShow: number
};

export default class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 4
  };

  increaseEventsToShow = () => {
    this.setState({ eventsToShow: this.state.eventsToShow * 2 });
  };

  render() {
    const isEvent = o => typeof o['startTime'] !== 'undefined';
    const { frontpage, feed, feedItems, loadingFrontpage } = this.props;

    return (
      <Container>
        <Helmet title="Hjem" />
        <Flex wrap style={{ justifyContent: 'space-between' }}>
          <Flex column style={{ flex: 2 }}>
            <CompactEvents events={frontpage.filter(isEvent)} />
            <LoadingIndicator loading={loadingFrontpage}>
              {frontpage[0] && <PrimaryItem item={frontpage[0]} />}
            </LoadingIndicator>
          </Flex>
          <Feed style={{ flex: 2 }} feed={feed} feedItems={feedItems} />
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme expanded={frontpage.length === 0} />
        </Flex>
        <Flex wrap>
          {frontpage
            .slice(1, this.state.eventsToShow)
            .map(event => (
              <OverviewItem
                key={event.id}
                item={event}
                increaseEventsToShow={this.increaseEventsToShow}
              />
            ))}
          {frontpage.length > 0 && (
            <Button
              style={{ width: '100%', margin: '10px' }}
              onClick={this.increaseEventsToShow}
            >
              Vis flere
            </Button>
          )}
        </Flex>
      </Container>
    );
  }
}
