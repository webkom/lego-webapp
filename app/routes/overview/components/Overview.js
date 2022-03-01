// @flow

import styles from './Overview.css';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Flex } from 'app/components/Layout';
import type { Event, Article } from 'app/models';
import cx from 'classnames';
import { renderMeta } from './utils';
import CompactEvents from './CompactEvents';
import Pinned from './Pinned';
import ArticleItem from './ArticleItem';
import PlacardButton from './PlacardButton';
import InterestgroupCard from './InterestgroupPlacard';
import ReadmeCard from './ReadmePlacard';
import WeeklyPlacard from './WeeklyPlacard';
import type { PollEntity } from 'app/reducers/polls';
import Poll from 'app/components/Poll';
import RandomQuote from 'app/components/RandomQuote';
import FancyNodesCanvas from 'app/components/Header/FancyNodesCanvas';

// POTENTIALLY DELETE/REMOVE
import NextEvent from './NextEvent';
import EventItem from './EventItem';
import LatestReadme from './LatestReadme';
import Icon from 'app/components/Icon';
import { Link } from 'react-router-dom';

//import Banner, { COLORS } from 'app/components/Banner';

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
    // const isEvent = (o) => typeof o['startTime'] !== 'undefined';
    const isEvent = (o) => !!o && o.documentType === 'event';
    const isArticle = (o) => !!o && o.documentType === 'article';
    const isInterestgroup = (o) =>
      o !== undefined && o.documentType === 'interestgroup';

    const { loggedIn, frontpage, readmes, poll, votePoll } = this.props;

    const compactEvents = (
      <CompactEvents
        events={frontpage.filter(isEvent)}
        className={styles.compactEvents}
      />
    );

    let pinnedElements = [
      frontpage.find(isEvent),
      frontpage.find(isArticle),
    ].filter((o) => o !== undefined);

    // const pinnedElements = frontpage.length // Why error!?
    //   ? [frontpage.find(isArticle), frontpage.find(isEvent)]
    //   : [];
    const pinnedIds = pinnedElements.map((pinned) => pinned?.id);

    const pinnedComponents = pinnedElements.map((pinned) => {
      return (
        pinned && (
          <div key={pinned.id} className={styles.pinned}>
            <Pinned
              item={pinned}
              url={this.itemUrl(pinned)}
              meta={renderMeta(pinned)}
            />
          </div>
        )
      );
    });

    const pinnedColumn = (
      <>
        <div className={styles.boardColumnTitle}>
          <i
            className="fa fa-thumb-tack"
            style={{
              transform: 'rotate(-20deg)',
              marginRight: '4px',
              color: '#BE1600',
            }}
          />
          FESTET
        </div>
        <div className={styles.pinnedComponentsWrapper}>{pinnedComponents}</div>
      </>
    );

    const articles = (
      <span className={styles.articles}>
        {frontpage
          .filter(isArticle)
          .filter((article) => !article.tags.includes('weekly'))
          .filter((article) => !pinnedIds.includes(article.id))
          .slice(0, this.state.articlesToShow)
          .map((article) => (
            <ArticleItem
              key={article.id}
              item={article}
              url={this.itemUrl(article)}
              meta={renderMeta(article)}
            />
          ))}
      </span>
    );
    const articlesColumn = (
      <>
        <div className={styles.boardColumnTitle}>
          <Link to="/articles">ARTIKLER</Link>
        </div>
        {articles}
      </>
    );

    const board = pinnedComponents.length > 1 && (
      <>
        <div className={styles.boardBackground}>
          <FancyNodesCanvas height={650} /> {/* hardcopy from styles.midRow */}
        </div>
        <Flex className={styles.boardWrapper}>
          <Flex column alignItems="center" className={styles.pinnedColumn}>
            {pinnedColumn}
          </Flex>
          <Flex
            column
            alignItems="flex-start"
            className={styles.articlesColumn}
          >
            {articlesColumn}
          </Flex>
        </Flex>
      </>
    );

    const pollItem = poll && (
      <Flex column className={cx(styles.cardWrapper, styles.pollWrapper)}>
        <Poll poll={poll} backgroundLight handleVote={votePoll} />
      </Flex>
    );

    const quoteItem = (
      <Flex column alignItems="center" className={styles.cardWrapper}>
        <RandomQuote loggedIn={loggedIn} className={styles.quote} />
        <PlacardButton belowCard to={'/quotes/?filter=all'}>
          OVERHØRT
        </PlacardButton>
      </Flex>
    );

    const weeklyArticle = frontpage
      .filter(isArticle)
      .filter((article) => article.tags.includes('weekly'))[0];

    const weekly = weeklyArticle && (
      <Flex className={styles.cardWrapper}>
        <WeeklyPlacard item={weeklyArticle} url={this.itemUrl(weeklyArticle)} />
      </Flex>
    );

    const readMe = readmes.length !== 0 && (
      <Flex className={styles.cardWrapper}>
        <ReadmeCard readmes={readmes} />
      </Flex>
    );

    const interestgroups = frontpage.filter(isInterestgroup);

    const interestgroup = interestgroups.length !== 0 && (
      <Flex className={styles.cardWrapper}>
        <InterestgroupCard interestGroups={interestgroups} />
      </Flex>
    );

    return (
      <Container>
        <Helmet title="Hjem" />
        {/* <Banner
          header="itDAGENE 20. & 21. september"
          subHeader="Kom til U1 i Realfagsbygget, kanskje finner du din drømmebedrift her?"
          link="https://itdagene.no"
          color={COLORS.itdageneBlue}
        /> */}
        <Flex column className={styles.desktopContainer}>
          <Flex column className={styles.topRow}>
            {compactEvents}
          </Flex>
          <Flex className={styles.midRow} alignItems="center">
            {board}
          </Flex>
          <Flex wrap className={styles.bottomRow}>
            {pollItem}
            {quoteItem}
            {weekly}
            {readMe}
            {interestgroup}
          </Flex>
        </Flex>
        <Flex column alignItems="center" className={styles.mobileContainer}>
          {compactEvents}
          {pollItem}
          {pinnedColumn}
          {articlesColumn}
          {readMe}
          {weekly}
          {interestgroup}
          {quoteItem}
        </Flex>
      </Container>
    );
  }
}

export default Overview;
