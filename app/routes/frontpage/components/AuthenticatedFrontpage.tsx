import { Container, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
//import Banner from 'app/components/Banner';
import p2 from 'app/assets/sommerfest/097e93e18fe0a537.png';
import CountDown from 'app/components/CountDown';
import Poll from 'app/components/Poll';
import RandomQuote from 'app/components/RandomQuote';
import Sommerfest from 'app/components/Sommerfest/Sommerfest';
import { selectArticles, selectArticlesByTag } from 'app/reducers/articles';
import { selectEvents } from 'app/reducers/events';
import {
  addArticleType,
  addEventType,
  selectPinned,
} from 'app/reducers/frontpage';
import { selectPinnedPolls } from 'app/reducers/polls';
import { selectRandomQuote } from 'app/reducers/quotes';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import ArticleItem from './ArticleItem';
import styles from './AuthenticatedFrontpage.css';
import CompactEvents from './CompactEvents';
import FrontpageEventItem from './FrontpageEventItem';
import LatestReadme from './LatestReadme';
import Pinned from './Pinned';
import UpcomingRegistrations from './UpcomingRegistrations';
import { itemUrl, renderMeta } from './utils';
import type { EntityId } from '@reduxjs/toolkit';
import type { FrontpageEvent } from 'app/store/models/Event';

const EVENTS_TO_SHOW = 9;
const ARTICLES_TO_SHOW = 2;

const AuthenticatedFrontpage = () => {
  const [eventsToShow, setEventsToShow] = useState(EVENTS_TO_SHOW);
  const [articlesToShow, setArticlesToShow] = useState(ARTICLES_TO_SHOW);

  const showMore = () => {
    setEventsToShow(eventsToShow + 6);
    setArticlesToShow(articlesToShow + 2);
  };

  const pinned = useAppSelector(selectPinned);
  const shouldFetchQuote = useAppSelector(selectRandomQuote) === undefined;
  const { loggedIn } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchIndex',
    () =>
      Promise.allSettled([
        loggedIn && shouldFetchQuote && dispatch(fetchRandomQuote()),
        dispatch(fetchReadmes(loggedIn ? 4 : 2)),
        dispatch(fetchData()),
      ]),
    [loggedIn, shouldFetchQuote],
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    //Need timeout because without page scrolls to botton of events not to top of page
    setTimeout(() => {
      setArticlesToShow(ARTICLES_TO_SHOW);
      setEventsToShow(EVENTS_TO_SHOW);
    }, 200);
  };

  const readMe = (
    <Flex className={styles.readMe}>
      <LatestReadme expandedInitially={false} />
    </Flex>
  );

  return (
    <Container>
      <Helmet title="Hjem" />
      <CountDown />
      {/* <Banner
        header="Billetter til Abakusrevyen ute nå!"
        subHeader="Kjøp billetter her"
        link="https://abakusrevyen.no/"
        color="red"
      /> */}
      <section className={styles.wrapper}>
        <CompactEvents className={styles.compactEvents} />
        <UpcomingRegistrationsSection />
        <Events pinnedId={pinned?.id} numberToShow={eventsToShow} />
        <Pinned item={pinned} url={itemUrl(pinned)} meta={renderMeta(pinned)} />
        <PollItem />
        <QuoteItem />
        {readMe}
        <Weekly />
        <Articles pinnedId={pinned?.id} numberToShow={articlesToShow} />
      </section>

      <ShowMoreButton
        eventsToShow={eventsToShow}
        showMore={showMore}
        scrollToTop={scrollToTop}
      />
    </Container>
  );
};

const Events = ({
  pinnedId,
  numberToShow,
}: {
  pinnedId: EntityId;
  numberToShow: number;
}) => {
  const allEvents = useAppSelector(selectEvents) as unknown as FrontpageEvent[];
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  const shownEvents = useMemo(
    () =>
      allEvents
        .filter((item) => item.id !== pinnedId)
        .filter((item) => moment(item.startTime).isAfter(moment()))
        .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)))
        .slice(0, numberToShow)
        .map(addEventType),
    [allEvents, pinnedId, numberToShow],
  );

  return (
    <Flex column className={styles.events}>
      <Link to="/events">
        <h3 className="u-ui-heading">Arrangementer</h3>
      </Link>

      <Flex column gap={20}>
        {fetching && !shownEvents.length
          ? Array.from({ length: EVENTS_TO_SHOW }).map((_, index) => (
              <FrontpageEventItem key={index} url="" meta={<></>} />
            ))
          : shownEvents.map((event) => (
              <FrontpageEventItem
                key={event.id}
                item={event}
                url={itemUrl(event)}
                meta={renderMeta(event)}
              />
            ))}
      </Flex>
    </Flex>
  );
};

const Weekly = () => {
  const weeklyArticles = useAppSelector((state) =>
    selectArticlesByTag(state, { tag: 'weekly' }),
  );
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.articles.fetching,
  );

  const newestWeekly = useMemo(
    () =>
      weeklyArticles.length
        ? addArticleType(
            weeklyArticles.sort((a, b) =>
              moment(b.createdAt).diff(moment(a.createdAt)),
            )[0],
          )
        : undefined,
    [weeklyArticles],
  );

  return (
    <>
      <Sommerfest src={p2} className={styles.sommerfest} />
      <Flex column className={styles.weekly}>
        <Link to="/articles?tag=weekly">
          <h3 className="u-ui-heading">Weekly</h3>
        </Link>

        {(fetching && !newestWeekly) || !newestWeekly ? (
          <ArticleItem url="" meta={<></>} />
        ) : (
          <ArticleItem
            key={newestWeekly.id}
            item={newestWeekly}
            url={itemUrl(newestWeekly)}
            meta={renderMeta(newestWeekly)}
          />
        )}
      </Flex>
    </>
  );
};

const Articles = ({
  pinnedId,
  numberToShow,
}: {
  pinnedId: EntityId;
  numberToShow: number;
}) => {
  const allArticles = useAppSelector(selectArticles);
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.articles.fetching,
  );

  const shownArticles = useMemo(
    () =>
      allArticles
        .filter((article) => !article.tags.includes('weekly'))
        .filter((article) => article.id !== pinnedId)
        .sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
        .slice(0, numberToShow)
        .map(addArticleType),
    [allArticles, pinnedId, numberToShow],
  );

  return (
    <Flex column className={styles.articles}>
      <Link to="/articles">
        <h3 className="u-ui-heading">Artikler</h3>
      </Link>

      <Flex column gap={20}>
        {fetching && !shownArticles.length
          ? Array.from({ length: ARTICLES_TO_SHOW }).map((_, index) => (
              <ArticleItem key={index} url="" meta={<></>} />
            ))
          : shownArticles.map((article) => (
              <ArticleItem
                key={article.id}
                item={article}
                url={itemUrl(article)}
                meta={renderMeta(article)}
              />
            ))}
      </Flex>
    </Flex>
  );
};

const UpcomingRegistrationsSection = () => (
  <Flex column className={styles.registrations}>
    <Link to="/events">
      <h3 className="u-ui-heading">Påmeldinger</h3>
    </Link>

    <UpcomingRegistrations />
  </Flex>
);

const PollItem = () => {
  const poll = useAppSelector(selectPinnedPolls)[0];
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.polls.fetching,
  );

  return (
    (fetching || poll) && (
      <Flex column className={styles.poll}>
        <Link to="/polls">
          <h3 className="u-ui-heading">Avstemning</h3>
        </Link>

        <Poll poll={poll} />
      </Flex>
    )
  );
};

const QuoteItem = () => (
  <Flex column className={styles.quote}>
    <Link to="/quotes">
      <h3 className="u-ui-heading">Overhørt</h3>
    </Link>

    <RandomQuote />
  </Flex>
);

const ShowMoreButton = ({
  eventsToShow,
  showMore,
  scrollToTop,
}: {
  eventsToShow: number;
  showMore: () => void;
  scrollToTop: () => void;
}) => {
  const events = useAppSelector(selectEvents);

  return (
    <div className={styles.showMore}>
      {events.length > eventsToShow && (
        <Icon onClick={showMore} name="chevron-down-outline" size={30} />
      )}

      {events.length < eventsToShow && (
        <Icon onClick={scrollToTop} name="chevron-up-outline" size={30} />
      )}
    </div>
  );
};

export default guardLogin(AuthenticatedFrontpage);
