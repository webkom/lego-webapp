// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Time from 'app/components/Time';
import { Container, Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import LatestReadme from './LatestReadme';
import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING } from 'app/routes/events/utils';
import Button from 'app/components/Button';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import Pinned from './Pinned';
import OverviewItem from './OverviewItem';

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

  itemUrl = (item: Event | Article) => {
    return `/${item.eventType ? 'events' : 'articles'}/${item.id}`;
  };

  renderMeta = (item: (Event | Article) & { documentType: string }) => {
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
              {frontpage[0] && (
                <Pinned
                  item={frontpage[0]}
                  url={this.itemUrl(frontpage[0])}
                  meta={this.renderMeta(frontpage[0])}
                />
              )}
            </LoadingIndicator>
          </Flex>
          <Feed style={{ flex: 2 }} feed={feed} feedItems={feedItems} />
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme expanded={frontpage.length === 0} />
        </Flex>
        <Flex wrap>
          <Flex column className={styles.header}>
            <p className="u-ui-heading">Andre oppslag</p>
          </Flex>

          {frontpage
            .slice(1, this.state.eventsToShow)
            .map(event => (
              <OverviewItem
                key={event.id}
                item={event}
                increaseEventsToShow={this.increaseEventsToShow}
                url={this.itemUrl(event)}
                meta={this.renderMeta(event)}
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
