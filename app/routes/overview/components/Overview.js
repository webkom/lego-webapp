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
import { Link } from 'react-router';
import NextEvent from './NextEvent';
import Poll from 'app/components/Poll';
import type { PollEntity } from 'app/reducers/polls';
import RandomQuote from 'app/components/RandomQuote';
import WeeklyItem from './Weekly';

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

    // CompactEvents Event Module
    const compactEvents = (
      <CompactEvents
        events={frontpage.filter(isEvent)}
        className={styles.compactEvents}
      />
    );

    // Resolve the pinned item
    const pinned = frontpage[0];

    // Pinned Module
    const pinnedComponent = pinned && (
      <div>
        <h3 className="u-ui-heading">Festet Oppslag</h3>
        <Pinned
          item={pinned}
          url={this.itemUrl(pinned)}
          meta={this.renderMeta(pinned)}
        />
      </div>
    );

    // Readme Module
    const readMe = (
      <div>
        <h3 className="u-ui-heading">Studentavis</h3>
        <LatestReadme readmes={readmes} expanded={frontpage.length === 0} />
      </div>
    );

    // Used to find events for the events module
    const resolveEvents = frontpage
      .filter(item => item.documentType === 'event')
      .filter(item => item != frontpage[0])
      .slice(0, this.state.eventsToShow);

    // Events Module
    const events = (
      <React.Fragment>
        <h3 className="u-ui-heading">Arrangementer</h3>
        <Flex className={styles.events}>
          {resolveEvents.map(event => (
            <EventItem
              key={event.id}
              item={event}
              url={this.itemUrl(event)}
              meta={this.renderMeta(event)}
              loggedIn={loggedIn}
            />
          ))}
        </Flex>
      </React.Fragment>
    );

    // Used to find the last weekly article for the weekly module
    const resolveLastWeekly = frontpage
      .filter(item => item.documentType === 'article')
      .filter(article => article.tags.includes('weekly'))[0];

    // Weekly Module
    const weekly = resolveLastWeekly && (
      <React.Fragment>
        <Link to={'/articles?tag=weekly'}>
          <h3 className="u-ui-heading">#Weekly</h3>
        </Link>
        <WeeklyItem
          key={resolveLastWeekly.id}
          item={resolveLastWeekly}
          url={this.itemUrl(resolveLastWeekly)}
        />
      </React.Fragment>
    );

    // Used to find the articles for the articles module
    const resolveArticles = frontpage
      .filter(item => item.documentType === 'article')
      .filter(article => !article.tags.includes('weekly'))
      .slice(0, this.state.articlesToShow);

    // Articles module
    const articles = resolveArticles && (
      <React.Fragment>
        <Link to="/articles">
          <h3 className="u-ui-heading">Artikler</h3>
        </Link>
        <Flex className={styles.articles}>
          {resolveArticles.map(article => (
            <ArticleItem
              key={article.id}
              item={article}
              url={this.itemUrl(article)}
              meta={this.renderMeta(article)}
            />
          ))}
        </Flex>
      </React.Fragment>
    );

    // NextEvent module
    const nextEvent = (
      <Flex column>
        <NextEvent
          events={frontpage.filter(item => item.documentType === 'event')}
        />
      </Flex>
    );

    // Poll Module
    const pollItem = poll && (
      <React.Fragment>
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
      </React.Fragment>
    );

    // Quote module
    const quoteItem = loggedIn && (
      <React.Fragment>
        <Link to={'/quotes'}>
          <h3 className="u-ui-heading">Overhørt</h3>
        </Link>
        <RandomQuote loggedIn={loggedIn} className={styles.quote} />
      </React.Fragment>
    );

    return (
      <Container>
        <LoadingIndicator loading={loadingFrontpage}>
          <Helmet title="Hjem" />
          <Flex className={styles.desktopContainer}>
            <Flex column className={styles.leftColumn}>
              {compactEvents}
              {pinnedComponent}
              {events}
            </Flex>
            <Flex column className={styles.rightColumn}>
              {nextEvent}
              {weekly}
              {pollItem}
              {quoteItem}
              {readMe}
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
        </LoadingIndicator>
      </Container>
    );
  }
}

export default Overview;
