import { Flex, Icon, PageContainer } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Banner from '~/components/Banner';
import CommandPalette from '~/components/CommandPalette';
import HsSectionContent from '~/components/HsSection/HsSection';
import Poll from '~/components/Poll';
import RandomQuote from '~/components/RandomQuote';
import { fetchCurrentPrivateBanner } from '~/redux/actions/BannerActions';
import { fetchData, fetchReadmes } from '~/redux/actions/FrontpageActions';
import { fetchRandomQuote } from '~/redux/actions/QuoteActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectArticles } from '~/redux/slices/articles';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectCurrentPrivateBanner } from '~/redux/slices/banner';
import { selectAllEvents } from '~/redux/slices/events';
import {
  addArticleType,
  addEventType,
  selectPinned,
} from '~/redux/slices/frontpage';
import { selectPinnedPoll } from '~/redux/slices/polls';
import { selectRandomQuote } from '~/redux/slices/quotes';
import utilStyles from '~/styles/utilities.module.css';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import ArticleItem from './ArticleItem';
import styles from './AuthenticatedFrontpage.module.css';
import CompactEvents from './CompactEvents';
import FrontpageEventItem from './FrontpageEventItem';
import LatestReadme from './LatestReadme';
import Pinned from './Pinned';
import UpcomingRegistrations from './UpcomingRegistrations';
import { itemUrl, renderMeta } from './utils';
import type { EntityId } from '@reduxjs/toolkit';
import type { FrontpageEvent } from '~/redux/models/Event';

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
  const loggedIn = useIsLoggedIn();

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

  usePreparedEffect(
    'fetchCurrentPrivateBanner',
    () => dispatch(fetchCurrentPrivateBanner()),
    [],
  );

  const currentPrivateBanner = useAppSelector((state) =>
    selectCurrentPrivateBanner(state, true),
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
    <PageContainer card={false}>
      <Helmet title="Hjem" />
      <CommandPalette />
      {currentPrivateBanner && (
        <Banner
          header={currentPrivateBanner.header}
          subHeader={currentPrivateBanner.subheader}
          link={currentPrivateBanner.link}
          color={currentPrivateBanner.color}
          countdownEndDate={currentPrivateBanner.countdownEndDate || undefined}
          countdownEndMessage={
            currentPrivateBanner.countdownEndMessage || undefined
          }
        />
      )}
      <section className={styles.wrapper}>
        <CompactEvents className={styles.compactEvents} />
        <UpcomingRegistrationsSection />
        <Events pinnedId={pinned?.id} numberToShow={eventsToShow} />
        <Pinned item={pinned} url={itemUrl(pinned)} meta={renderMeta(pinned)} />
        <PollItem />
        <QuoteItem />
        {readMe}
        <HSSection />
        <Articles pinnedId={pinned?.id} numberToShow={articlesToShow} />
      </section>

      <ShowMoreButton
        eventsToShow={eventsToShow}
        showMore={showMore}
        scrollToTop={scrollToTop}
      />
    </PageContainer>
  );
};

const Events = ({
  pinnedId,
  numberToShow,
}: {
  pinnedId: EntityId;
  numberToShow: number;
}) => {
  const allEvents = useAppSelector(selectAllEvents<FrontpageEvent>);
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
      <a href="/events">
        <h3 className={utilStyles.frontPageHeader}>Arrangementer</h3>
      </a>

      <Flex column gap="var(--spacing-md)">
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

const HSSection = () => {
  return (
    <Flex column className={styles.hovedstyret}>
      <h3 className={utilStyles.frontPageHeader}>Hovedstyret</h3>
      <HsSectionContent />
    </Flex>
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
      <a href="/articles">
        <h3 className={utilStyles.frontPageHeader}>Artikler</h3>
      </a>

      <Flex column gap="var(--spacing-md)">
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
    <a href="/events">
      <h3 className={utilStyles.frontPageHeader}>Påmeldinger</h3>
    </a>

    <UpcomingRegistrations />
  </Flex>
);

const PollItem = () => {
  const poll = useAppSelector(selectPinnedPoll);
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.polls.fetching,
  );

  return (
    (fetching || poll) && (
      <Flex column className={styles.poll}>
        <a href="/polls">
          <h3 className={utilStyles.frontPageHeader}>Avstemning</h3>
        </a>

        <Poll poll={poll} />
      </Flex>
    )
  );
};

const QuoteItem = () => (
  <Flex column className={styles.quote}>
    <a href="/quotes">
      <h3 className={utilStyles.frontPageHeader}>Overhørt</h3>
    </a>

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
  const events = useAppSelector(selectAllEvents<FrontpageEvent>);

  return (
    <div className={styles.showMore} data-test-id="frontpage-show-more">
      {events.length > eventsToShow && (
        <Icon onPress={showMore} iconNode={<ChevronDown />} size={30} />
      )}

      {events.length < eventsToShow && (
        <Icon onPress={scrollToTop} iconNode={<ChevronUp />} size={30} />
      )}
    </div>
  );
};

export default guardLogin(AuthenticatedFrontpage);
