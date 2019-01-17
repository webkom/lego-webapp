// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Time from 'app/components/Time';
import { Container, Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import LatestReadme from './LatestReadme';
// import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING } from 'app/routes/events/utils';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import Pinned from './Pinned';
import EventItem from './EventItem';
import ArticleItem from './ArticleItem';
import Icon from 'app/components/Icon';
import truncateString from 'app/utils/truncateString';
import { Link } from 'react-router';

type Props = {
  frontpage: Array<Object>,
  // feed: Object,
  // feedItems: Array<Object>,
  readmes: Array<Object>,
  loadingFrontpage: boolean
};

type State = {
  eventsToShow: number,
  articlesToShow: number
};

class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 6,
    articlesToShow: 2
  };

  showMore = () => {
    this.setState({
      eventsToShow: this.state.eventsToShow + 6,
      articlesToShow: this.state.articlesToShow + 2
    });
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

        {item.location !== '-' && isEvent && (
          <span>
            <span className={styles.dot}> . </span>
            <span> {truncateString(item.location, 10)} </span>
          </span>
        )}

        <span>
          <span className={styles.dot}> . </span>
          <span>
            {' '}
            {isEvent ? EVENT_TYPE_TO_STRING(item.eventType) : 'Artikkel'}{' '}
          </span>
        </span>

        {item.tags && item.tags.length > 0 && (
          <Tags className={styles.tagline}>
            {item.tags.slice(0, 3).map(tag => (
              <Tag className={styles.tag} tag={tag} key={tag} />
            ))}
          </Tags>
        )}
      </span>
    );
  };

  render() {
    const isEvent = o => typeof o['startTime'] !== 'undefined';
    const {
      frontpage,
      // feed,
      // feedItems,
      loadingFrontpage,
      readmes
    } = this.props;
    const pinned = frontpage[0];

    return (
      <Container>
        <Helmet title="Hjem" />
        <Flex wrap style={{ justifyContent: 'space-between' }}>
          <Flex column style={{ flex: 2 }}>
            <CompactEvents events={frontpage.filter(isEvent)} />
            <LoadingIndicator loading={loadingFrontpage}>
              {pinned && (
                <Pinned
                  item={pinned}
                  url={this.itemUrl(pinned)}
                  meta={this.renderMeta(pinned)}
                />
              )}
            </LoadingIndicator>
          </Flex>
          {/* <Feed style={{ flex: 2 }} feed={feed} feedItems={feedItems} /> */}
          <Flex
            column
            style={{ flex: '1', padding: '0 10px', margin: '0 auto' }}
          >
            <Link to={'/articles?tag=weekly'}>
              <h3 className="u-ui-heading" style={{ paddingTop: 0 }}>
                Weekly
              </h3>
            </Link>

            <Flex column className={styles.weeklyArticles}>
              {frontpage
                .filter(item => item.documentType === 'article')
                .filter(article => article.tags.includes('weekly'))
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
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme readmes={readmes} expanded={frontpage.length === 0} />
        </Flex>

        <Flex className={styles.otherItems}>
          <Flex column style={{ flex: '2' }}>
            <Link to={'/events'}>
              <h3 className="u-ui-heading">Arrangementer</h3>
            </Link>
            <Flex className={styles.events}>
              {frontpage
                .filter(item => item.documentType === 'event')
                .filter(item => item != frontpage[0])
                .slice(0, this.state.eventsToShow)
                .map(event => (
                  <EventItem
                    key={event.id}
                    item={event}
                    url={this.itemUrl(event)}
                    meta={this.renderMeta(event)}
                  />
                ))}
            </Flex>
          </Flex>

          <Flex column style={{ flex: '1' }}>
            <Link to={'/articles'}>
              <h3 className="u-ui-heading">Artikler</h3>
            </Link>
            <Flex className={styles.articles}>
              {frontpage
                .filter(item => item.documentType === 'article')
                .filter(article => !article.tags.includes('weekly'))
                .slice(0, this.state.articlesToShow)
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
        </Flex>

        {frontpage.length > 8 && (
          <div className={styles.showMore}>
            <Icon onClick={this.showMore} size={40} name="arrow-dropdown" />
          </div>
        )}
      </Container>
    );
  }
}

export default Overview;
