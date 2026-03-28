import { Flex, Icon, PageContainer } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Banner from '~/components/Banner';
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
    selectCurrentPrivateBanner(state),
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
    <div className={styles.page}>
      <PageContainer card={false}>
        <div className={styles.content}>
          <Helmet title="Hjem" />
          {currentPrivateBanner && (
            <Banner
              header={currentPrivateBanner.header}
              subHeader={currentPrivateBanner.subheader}
              link={currentPrivateBanner.link}
              color={currentPrivateBanner.color}
              countdownEndDate={
                currentPrivateBanner.countdownEndDate || undefined
              }
              countdownEndMessage={
                currentPrivateBanner.countdownEndMessage || undefined
              }
            />
          )}
          <section className={styles.wrapper}>
            <div className={styles.topGrid}>
              <CompactEvents className={styles.compactEvents} />
              <UpcomingRegistrationsSection />
            </div>
            <div className={styles.lowerContent}>
              <div aria-hidden="true" className={styles.waveViewport}>
                <div className={styles.waveInner}>
                  <div className={`${styles.waveLayer} ${styles.waveTop}`}>
                    <WaveSvg className={styles.waveSvg} type="top" />
                    <WaveSvg className={styles.waveSvg} type="top" />
                    <WaveSvg className={styles.waveSvg} type="top" />
                  </div>
                  <div className={`${styles.waveLayer} ${styles.waveMiddle}`}>
                    <WaveSvg className={styles.waveSvg} type="mid" />
                    <WaveSvg className={styles.waveSvg} type="mid" />
                    <WaveSvg className={styles.waveSvg} type="mid" />
                  </div>
                  <div className={`${styles.waveLayer} ${styles.waveBottom}`}>
                    <WaveSvg className={styles.waveSvg} type="btm" />
                    <WaveSvg className={styles.waveSvg} type="btm" />
                    <WaveSvg className={styles.waveSvg} type="btm" />
                  </div>
                </div>
              </div>
              <div className={styles.lowerGrid}>
                <Events pinnedId={pinned?.id} numberToShow={eventsToShow} />
                <Pinned
                  item={pinned}
                  url={itemUrl(pinned)}
                  meta={renderMeta(pinned)}
                />
                <PollItem />
                <QuoteItem />
                {readMe}
                <HSSection />
                <Articles pinnedId={pinned?.id} numberToShow={articlesToShow} />
              </div>
            </div>
          </section>

          <ShowMoreButton
            eventsToShow={eventsToShow}
            showMore={showMore}
            scrollToTop={scrollToTop}
          />
        </div>
      </PageContainer>
    </div>
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

type WaveSvgProps = {
  className?: string;
  type: 'top' | 'mid' | 'btm';
};
function WaveSvg({ className, type }: WaveSvgProps) {
  if (type === 'top') {
    return (
      <svg
        className={className}
        height="119pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 119"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,119) scale(0.1,-0.1)">
          <path d="M0 592 l0 -592 9600 0 9600 0 0 592 0 591 -202 -7 c-537 -18 -1061 -71 -2398 -241 -1857 -236 -2519 -295 -3321 -295 -808 0 -1384 59 -2769 285 -869 141 -1176 183 -1605 220 -656 55 -1173 43 -1765 -41 -369 -53 -719 -126 -1485 -309 -569 -135 -908 -201 -1260 -242 -190 -22 -747 -25 -930 -5 -402 44 -657 99 -1315 282 -886 248 -1318 324 -1952 346 l-198 7 0 -591z" />
        </g>
      </svg>
    );
  } else if (type === 'mid') {
    return (
      <svg
        className={className}
        height="167pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 167"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,167) scale(0.1,-0.1)">
          <path d="M0 832 l0 -832 9600 0 9600 0 0 830 0 830 -67 0 c-295 -1 -926 -51 -1513 -121 -838 -100 -1519 -203 -3560 -544 -2521 -420 -2893 -466 -3240 -400 -269 51 -484 136 -1085 428 -639 309 -931 426 -1311 521 -322 82 -564 111 -919 110 -287 0 -425 -10 -703 -50 -427 -61 -747 -144 -1477 -384 -1010 -332 -1357 -402 -1915 -387 -525 15 -920 108 -1615 383 -853 337 -1161 420 -1637 440 l-158 7 0 -831z" />
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        className={className}
        height="219pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 219"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,219) scale(0.1,-0.1)">
          <path d="M0 1096 l0 -1096 9600 0 9600 0 0 1096 0 1096 -122 -7 c-556 -30 -1086 -128 -2168 -401 -1025 -260 -1253 -317 -1475 -367 -1540 -354 -2283 -397 -3300 -192 -432 88 -775 185 -1615 460 -990 324 -1443 434 -2005 486 -169 16 -558 16 -710 0 -400 -42 -789 -143 -1235 -322 -228 -91 -439 -186 -900 -406 -619 -296 -890 -405 -1197 -482 -207 -52 -286 -63 -505 -68 -302 -8 -490 19 -768 109 -264 85 -506 202 -1016 489 -350 196 -600 325 -794 406 -426 180 -796 265 -1257 288 l-133 7 0 -1096z" />
        </g>
      </svg>
    );
  }
}
