// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Time from 'app/components/Time';
import { Container, Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import LatestReadme from './LatestReadme';
import CompactEvents from './CompactEvents';
import { eventTypeToString } from 'app/routes/events/utils';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import Pinned from './Pinned';
import EventItem from './EventItem';
import ArticleItem from './ArticleItem';
import Icon from 'app/components/Icon';
import truncateString from 'app/utils/truncateString';
import { Link } from 'react-router-dom';
import NextEvent from './NextEvent';
import Poll from 'app/components/Poll';
import type { PollEntity } from 'app/reducers/polls';
import RandomQuote from 'app/components/RandomQuote';

type Props = {
  frontpage: Array<Object>,
  readmes: Array<Object>,
  loadingFrontpage: boolean,
  poll: ?PollEntity,
  votePoll: () => Promise<*>,
  loggedIn: boolean
};

type State = {
  eventsToShow: number,
  articlesToShow: number
};

class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 9,
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
            {isEvent ? eventTypeToString(item.eventType) : 'Artikkel'}{' '}
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
      loggedIn,
      frontpage,
      loadingFrontpage,
      readmes,
      poll,
      votePoll
    } = this.props;
    const pinned = frontpage[0];
    console.log(this.props);
    const compactEvents = (
      <CompactEvents
        events={frontpage.filter(isEvent)}
        className={styles.compactEvents}
      />
    );

    const pinnedComponent = (
      <LoadingIndicator loading={loadingFrontpage}>
        {pinned && (
          <div className={styles.pinned}>
            <Pinned
              item={pinned}
              url={this.itemUrl(pinned)}
              meta={this.renderMeta(pinned)}
            />
          </div>
        )}
      </LoadingIndicator>
    );

    const readMe = (
      <Flex className={styles.readMe}>
        <LatestReadme readmes={readmes} expanded={frontpage.length === 0} />
      </Flex>
    );

    const events = (
      <Flex column className={styles.eventsWrapper}>
        <Link to="/events">
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
                loggedIn={loggedIn}
              />
            ))}
        </Flex>
      </Flex>
    );

    const weeklyArticle = frontpage
      .filter(item => item.documentType === 'article')
      .filter(article => article.tags.includes('weekly'))[0];

    const weekly = (
      <Flex column className={styles.weekly}>
        {weeklyArticle && (
          <>
            <Link to={'/articles?tag=weekly'}>
              <h3 className="u-ui-heading">Weekly</h3>
            </Link>
            <ArticleItem
              key={weeklyArticle.id}
              item={weeklyArticle}
              url={this.itemUrl(weeklyArticle)}
              meta={this.renderMeta(weeklyArticle)}
              weekly
            />
          </>
        )}
      </Flex>
    );

    const articles = (
      <Flex column className={styles.articlesWrapper}>
        <Link to="/articles">
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
    );

    const nextEvent = (
      <Flex column>
        <Link to="/events">
          <h3 className="u-ui-heading" style={{ padding: '5px 10px 10px' }}>
            Påmeldinger
          </h3>
        </Link>
        <NextEvent
          events={frontpage.filter(item => item.documentType === 'event')}
        />
      </Flex>
    );

    const pollItem = (
      <Flex column className={styles.poll}>
        {poll && (
          <>
            <Link to={'/polls'}>
              <h3 className="u-ui-heading">Avstemning</h3>
            </Link>
            <Poll
              style={{ flex: 'none' }}
              poll={poll}
              backgroundLight
              truncate={3}
              handleVote={votePoll}
            />
          </>
        )}
      </Flex>
    );

    const quoteItem = (
      <Flex column>
        <Link to={'/quotes'}>
          <h3 className="u-ui-heading">Overhørt</h3>
        </Link>
        <RandomQuote loggedIn={loggedIn} className={styles.quote} />
      </Flex>
    );

    return (
      <Container>
        <Helmet title="Hjem" />
        <Flex className={styles.desktopContainer}>
          <Flex column className={styles.leftColumn}>
            {compactEvents}
            {pinnedComponent}
            {events}
          </Flex>
          <Flex column className={styles.rightColumn}>
            {nextEvent}
            {pollItem}
            {quoteItem}
            {readMe}
            {weekly}
            {articles}
          </Flex>
        </Flex>
        <section className={styles.mobileContainer}>
          {compactEvents}
          {nextEvent}
          {pollItem}
          {quoteItem}
          {pinnedComponent}
          {readMe}
          {weekly}
          {articles}
          {events}
        </section>
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
