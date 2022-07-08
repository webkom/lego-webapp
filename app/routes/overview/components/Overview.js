// @flow

import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import Banner, { COLORS } from 'app/components/Banner';
import Icon from 'app/components/Icon';
import { Container, Flex } from 'app/components/Layout';
import Poll from 'app/components/Poll';
import RandomQuote from 'app/components/RandomQuote';
import type { Article, Event } from 'app/models';
import type { PollEntity } from 'app/reducers/polls';
import ArticleItem from './ArticleItem';
import CompactEvents from './CompactEvents';
import EventItem from './EventItem';
import LatestReadme from './LatestReadme';
import NextEvent from './NextEvent';
import Pinned from './Pinned';
import { renderMeta } from './utils';

import styles from './Overview.css';

type Props = {
  frontpage: Array<Object>,
  readmes: Array<Object>,
  poll: ?PollEntity,
  votePoll: () => Promise<*>,
  loggedIn: boolean,
};

type State = {
  eventsToShow: number,
  articlesToShow: number,
};

class Overview extends Component<Props, State> {
  state = {
    eventsToShow: 9,
    articlesToShow: 2,
  };

  showMore = () => {
    this.setState({
      eventsToShow: this.state.eventsToShow + 6,
      articlesToShow: this.state.articlesToShow + 2,
    });
  };

  itemUrl = (item: Event | Article) => {
    return `/${item.eventType ? 'events' : 'articles'}/${item.id}`;
  };

  render() {
    const isEvent = (o) => typeof o['startTime'] !== 'undefined';
    const { loggedIn, frontpage, readmes, poll, votePoll } = this.props;
    const pinned = frontpage[0];
    const compactEvents = (
      <CompactEvents
        events={frontpage.filter(isEvent)}
        className={styles.compactEvents}
      />
    );

    const pinnedComponent = pinned && (
      <div className={styles.pinned}>
        <Pinned
          item={pinned}
          url={this.itemUrl(pinned)}
          meta={renderMeta(pinned)}
        />
      </div>
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
            .filter((item) => item.documentType === 'event')
            .filter((item) => item !== frontpage[0])
            .slice(0, this.state.eventsToShow)
            .map((event) => (
              <EventItem
                key={event.id}
                item={event}
                url={this.itemUrl(event)}
                meta={renderMeta(event)}
                loggedIn={loggedIn}
                isFrontPage={true}
              />
            ))}
        </Flex>
      </Flex>
    );

    const weeklyArticle = frontpage
      .filter((item) => item.documentType === 'article')
      .filter((article) => article.tags.includes('weekly'))[0];

    const weekly = (
      <Flex column className={styles.weekly}>
        {weeklyArticle && (
          <>
            <Link to="/articles?tag=weekly">
              <h3 className="u-ui-heading">Weekly</h3>
            </Link>
            <ArticleItem
              key={weeklyArticle.id}
              item={weeklyArticle}
              url={this.itemUrl(weeklyArticle)}
              meta={renderMeta(weeklyArticle)}
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
            .filter((item) => item.documentType === 'article')
            .filter((article) => !article.tags.includes('weekly'))
            .filter((article) => article.id !== pinned.id)
            .slice(0, this.state.articlesToShow)
            .map((article) => (
              <ArticleItem
                key={article.id}
                item={article}
                url={this.itemUrl(article)}
                meta={renderMeta(article)}
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
          events={frontpage.filter((item) => item.documentType === 'event')}
        />
      </Flex>
    );

    const pollItem = (
      <Flex column className={styles.poll}>
        {poll && (
          <>
            <Link to="/polls">
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
        <Link to="/quotes">
          <h3 className="u-ui-heading">Overhørt</h3>
        </Link>
        <RandomQuote loggedIn={loggedIn} className={styles.quote} />
      </Flex>
    );

    return (
      <Container>
        <Helmet title="Hjem" />
        <Banner
          header="Velkommen til fadderperioden 2022!"
          subHeader="Trykk her for mer informasjon"
          link="articles/414"
          color={COLORS.buddyweek2022}
          internal
        />
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
