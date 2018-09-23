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
import EventItem from './EventItem';
import ArticleItem from './ArticleItem';

type Props = {
  frontpage: Array<Object>,
  feed: Object,
  feedItems: Array<Object>,
  loadingFrontpage: boolean
};

type State = {
  eventsToShow: number,
  articlesToShow: number
};

class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 7,
    articlesToShow: 3
  };

  increaseEventsToShow = () => {
    this.setState({ eventsToShow: this.state.eventsToShow * 2 });
  };

  itemUrl = (item: Event | Article) => {
    return `/${item.eventType ? 'events' : 'articles'}/${item.id}`;
  };

  renderMeta = (item: (Event | Article) & { documentType: string }) => {
    const isEvent = item.eventType ? true : false;
    return (
      <span className={styles.itemInfo}>
        <Time
          time={isEvent ? item.startTime : item.createdAt}
          format="DD.MM HH:mm"
        />

        {item.location !== '-' &&
          isEvent && (
            <span>
              <span className={styles.dot}> . </span>
              <span> {item.location} </span>
            </span>
          )}

        <span>
          <span className={styles.dot}> . </span>
          <span>
            {' '}
            {isEvent ? EVENT_TYPE_TO_STRING(item.eventType) : 'Artikkel'}{' '}
          </span>
        </span>

        {item.tags &&
          item.tags.length > 0 && (
            <Tags className={styles.tagline}>
              {item.tags
                .slice(0, 3)
                .map(tag => <Tag className={styles.tag} tag={tag} key={tag} />)}
            </Tags>
          )}
      </span>
    );
  };

  render() {
    const isEvent = o => typeof o['startTime'] !== 'undefined';
    const { frontpage, feed, feedItems, loadingFrontpage } = this.props;
    console.log(frontpage);
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

        <Flex row className={styles.header}>
          <p className="u-ui-heading" style={{ flex: '1.9' }}>
            Arrangementer
          </p>
          <p className="u-ui-heading" style={{ flex: '1' }}>
            Artikler
          </p>
        </Flex>

        <Flex row className={styles.otherItems}>
          <Flex className={styles.events}>
            {frontpage
              .slice(1, this.state.eventsToShow)
              .filter(item => item.documentType === 'event')
              .map(event => (
                <EventItem
                  key={event.id}
                  item={event}
                  increaseEventsToShow={this.increaseEventsToShow}
                  url={this.itemUrl(event)}
                  meta={this.renderMeta(event)}
                />
              ))}
          </Flex>

          <Flex className={styles.articles}>
            {frontpage
              .filter(item => item.documentType === 'article')
              .slice(1, this.state.articlesToShow)
              .map(article => (
                <ArticleItem
                  key={article.id}
                  item={article}
                  url={this.itemUrl(article)}
                  meta={this.renderMeta(article)}
                />
              ))}
          </Flex>
        </Flex>

        <div>
          {frontpage.length > 0 && (
            <Button
              style={{ width: '100%', margin: '10px' }}
              onClick={this.increaseEventsToShow}
            >
              Vis flere
            </Button>
          )}
        </div>
      </Container>
    );
  }
}

export default Overview;
