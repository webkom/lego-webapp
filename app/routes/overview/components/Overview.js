// @flow

import styles from './Overview.css';
import { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Flex } from 'app/components/Layout';
import LatestReadme from './LatestReadme';
import CompactEvents from './CompactEvents';
import type { Event, Article } from 'app/models';
import Pinned from './Pinned';
import EventItem from './EventItem';
import ArticleItem from './ArticleItem';
import Icon from 'app/components/Icon';
import { Link } from 'react-router-dom';
import NextEvent from './NextEvent';
import Poll from 'app/components/Poll';
import type { PollEntity } from 'app/reducers/polls';
import RandomQuote from 'app/components/RandomQuote';
import FancyNodesCanvas from '../../../../app/components/Header/FancyNodesCanvas';
import { renderMeta } from './utils';
import WeeklyCard from './WeeklyCard';
import ReadmeCard from './ReadmeCard';
import InterestgroupCard from './InterestgroupCard';
import CardButton from './CardButton';
import cx from 'classnames';

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
    const isEvent = (o) => typeof o['startTime'] !== 'undefined';
    const { loggedIn, frontpage, readmes, poll, votePoll } = this.props;
    const pinned = frontpage[0];

    const compactEvents = (
      <CompactEvents
        events={frontpage.filter(isEvent)}
        //className={styles.compactEvents}
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

    // const readMe = (
    //   <Flex className={styles.readMe}>
    //     <LatestReadme readmes={readmes} expanded={frontpage.length === 0} />
    //   </Flex>
    // );

    const readMe = readmes.length != 0 && (
      <Flex className={styles.cardWrapper}>
        <ReadmeCard readmes={readmes} />
      </Flex>
    );

    // const events = (
    //   <Flex column className={styles.eventsWrapper}>
    //     <Link to="/events">
    //       <h3 className="u-ui-heading">Arrangementer</h3>
    //     </Link>

    //     <Flex className={styles.events}>
    //       {frontpage
    //         .filter((item) => item.documentType === 'event')
    //         .filter((item) => item !== frontpage[0])
    //         .slice(0, this.state.eventsToShow)
    //         .map((event) => (
    //           <EventItem
    //             key={event.id}
    //             item={event}
    //             url={this.itemUrl(event)}
    //             meta={renderMeta(event)}
    //             loggedIn={loggedIn}
    //             isFrontPage={true}
    //           />
    //         ))}
    //     </Flex>
    //   </Flex>
    // );

    const weeklyArticle = frontpage
      .filter((item) => item.documentType === 'article')
      .filter((article) => article.tags.includes('weekly'))[0];

    // const weekly = (
    //   <Flex column className={styles.weekly}>
    //     {weeklyArticle && (
    //       <>
    //         <Link to="/articles?tag=weekly">
    //           <h3 className="u-ui-heading">Weekly</h3>
    //         </Link>
    //         <ArticleItem
    //           key={weeklyArticle.id}
    //           item={weeklyArticle}
    //           url={this.itemUrl(weeklyArticle)}
    //           meta={renderMeta(weeklyArticle)}
    //           weekly
    //         />
    //       </>
    //     )}
    //   </Flex>
    // );

    /* NEW COMPONENT */
    const weekly = weeklyArticle && (
      <Flex className={styles.cardWrapper}>
        <WeeklyCard item={weeklyArticle} url={this.itemUrl(weeklyArticle)} />
      </Flex>
    );

    const quoteItem = (
      <Flex column alignItems="center" className={styles.cardWrapper}>
        <Flex column alignItems="center" styles={{ flex: 1 }}>
          <RandomQuote loggedIn={loggedIn} className={styles.quote} />
        </Flex>
        <CardButton belowCard to={'/quotes/?filter=all'}>
          OVERHØRT
        </CardButton>
      </Flex>
    );

    const interestgroups = frontpage.filter(
      (item) => item.documentType === 'interestgroup'
    );

    const interestgroup = interestgroups.length != 0 && (
      <Flex className={styles.cardWrapper}>
        <InterestgroupCard interestGroups={interestgroups} />
      </Flex>
    );

    // const articles = (
    //   <Flex column className={styles.articlesWrapper}>
    //     <Link to="/articles">
    //       <h3 className="u-ui-heading">Artikler</h3>
    //     </Link>
    //     <Flex className={styles.articles}>
    //       {frontpage
    //         .filter((item) => item.documentType === 'article')
    //         .filter((article) => !article.tags.includes('weekly'))
    //         .filter((article) => article.id !== pinned.id)
    //         .slice(0, this.state.articlesToShow)
    //         .map((article) => (
    //           <ArticleItem
    //             key={article.id}
    //             item={article}
    //             url={this.itemUrl(article)}
    //             meta={renderMeta(article)}
    //           />
    //         ))}
    //     </Flex>
    //   </Flex>
    // );

    const imageHolder = (
      <div
        style={{ height: '400px', width: '90%', 'background-color': 'yellow' }}
      ></div>
    );

    const articleHolder = (
      <div
        style={{ flex: 1, width: '90%', 'background-color': 'yellow' }}
      ></div>
    );

    const articles = frontpage
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
      ));

    const board = pinned && (
      <Flex className={styles.boardWrapper}>
        <Flex column alignItems="center" className={styles.pinnedColumn}>
          {pinnedComponent}
          {pinnedComponent}
          <CardButton belowCard to="/test">
            Hei
          </CardButton>
        </Flex>
        <Flex column alignItems="center" className={styles.articlesColumn}>
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
          {/* {quoteItem} */}
          <CardButton to="/test" belowCard>
            Hei
          </CardButton>
        </Flex>
      </Flex>
    );

    const pollItem = poll && (
      <Flex column className={cx(styles.cardWrapper, styles.pollWrapper)}>
        <Poll poll={poll} backgroundLight truncate={0} handleVote={votePoll} />
      </Flex>
    );

    return (
      <Container>
        <Helmet title="Hjem" />
        {/*<Banner
          header="itDAGENE 20. & 21. september"
          subHeader="Kom til U1 i Realfagsbygget, kanskje finner du din drømmebedrift her?"
          link="https://itdagene.no"
          color={COLORS.itdageneBlue}
        />*/}
        <Flex column className={styles.desktopContainer}>
          <Flex column className={styles.topRow}>
            {compactEvents}
          </Flex>
          <Flex column className={styles.midRow}>
            <div className={styles.boardBackground}>
              <FancyNodesCanvas height={600} />
            </div>
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
          {pinnedComponent}
          {pinnedComponent}
          {readMe}
          {weekly}
          {interestgroup}
          {quoteItem}
        </Flex>
        {/* {frontpage.length > 8 && (
          <div className={styles.showMore}>
            <Icon onClick={this.showMore} size={40} name="arrow-dropdown" />
          </div>
        )} */}
      </Container>
    );
  }
}

export default Overview;
