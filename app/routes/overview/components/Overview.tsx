import { Container, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import Banner from 'app/components/Banner';
import Poll from 'app/components/Poll';
import RandomQuote from 'app/components/RandomQuote';
import { isArticle, isEvent, selectFrontpage } from 'app/reducers/frontpage';
import { selectPinnedPolls } from 'app/reducers/polls';
import { selectRandomQuote } from 'app/reducers/quotes';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import ArticleItem from './ArticleItem';
import CompactEvents from './CompactEvents';
import EventItem from './EventItem';
import LatestReadme from './LatestReadme';
import NextEvent from './NextEvent';
import styles from './Overview.css';
import Pinned from './Pinned';
import PublicFrontpage from './PublicFrontpage';
import { itemUrl, renderMeta } from './utils';
import type { Event } from 'app/models';
import type { WithDocumentType } from 'app/reducers/frontpage';
import type { PublicArticle } from 'app/store/models/Article';

const EVENTS_TO_SHOW = 9;
const ARTICLES_TO_SHOW = 2;

const Overview = () => {
  const [eventsToShow, setEventsToShow] = useState(EVENTS_TO_SHOW);
  const [articlesToShow, setArticlesToShow] = useState(ARTICLES_TO_SHOW);

  const showMore = () => {
    setEventsToShow(eventsToShow + 6);
    setArticlesToShow(articlesToShow + 2);
  };

  const frontpage = useAppSelector(selectFrontpage);
  const fetchingFrontpage = useAppSelector((state) => state.frontpage.fetching);
  const readmes = useAppSelector((state) => state.readme);
  const shouldFetchQuote = isEmpty(useAppSelector(selectRandomQuote));
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
    [loggedIn, shouldFetchQuote]
  );

  const events = useMemo(() => frontpage.filter(isEvent), [frontpage]);

  const pinned = frontpage[0];

  const eventsShown = useMemo(
    () =>
      events
        .filter(
          (item) =>
            item.id !== pinned.id &&
            isEvent(item) &&
            moment(item.startTime).isAfter(moment())
        )
        .slice(0, eventsToShow),
    [events, eventsToShow, pinned]
  );

  const articles = useMemo(
    () => frontpage.filter(isArticle) as WithDocumentType<PublicArticle>[],
    [frontpage]
  );

  const weeklyArticle = useMemo(
    () => articles.filter((article) => article.tags.includes('weekly'))[0],
    [articles]
  );

  const articlesShown = useMemo(
    () =>
      articles
        .filter((article) => !article.tags.includes('weekly'))
        .filter((article) => article.id !== pinned.id)
        .slice(0, articlesToShow),
    [articles, articlesToShow, pinned]
  );

  const readMe = (
    <Flex className={styles.readMe}>
      <LatestReadme
        readmes={readmes}
        expandedInitially={frontpage.length === 0 && !fetchingFrontpage}
      />
    </Flex>
  );

  return (
    <Container>
      <Helmet title="Hjem" />
      <Banner
        header="Billetter til Abakusrevyen ute nå!"
        subHeader="Kjøp billetter her"
        link="https://abakusrevyen.no/"
        color="red"
      />
      <section className={styles.wrapper}>
        <CompactEvents events={events} className={styles.compactEvents} />
        <NextEventSection events={events} />
        <Events events={eventsShown} />
        <Pinned item={pinned} url={itemUrl(pinned)} meta={renderMeta(pinned)} />
        <PollItem />
        <QuoteItem />
        {readMe}
        <Weekly weeklyArticle={weeklyArticle} />
        <Articles articles={articlesShown} />
      </section>

      {frontpage.length > 8 && events.length > eventsToShow && (
        <div className={styles.showMore}>
          <Icon onClick={showMore} name="chevron-down-outline" size={30} />
        </div>
      )}
    </Container>
  );
};

const Events = ({ events }: { events: WithDocumentType<Event>[] }) => {
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching
  );

  return (
    <Flex column className={styles.events}>
      <Link to="/events">
        <h3 className="u-ui-heading">Arrangementer</h3>
      </Link>

      <Flex column gap={20}>
        {fetching && !events.length
          ? Array.from({ length: EVENTS_TO_SHOW }).map((_, index) => (
              <EventItem key={index} url="" meta={<></>} isFrontPage={true} />
            ))
          : events.map((event) => (
              <EventItem
                key={event.id}
                item={event}
                url={itemUrl(event)}
                meta={renderMeta(event)}
                isFrontPage={true}
              />
            ))}
      </Flex>
    </Flex>
  );
};

const Weekly = ({
  weeklyArticle,
}: {
  weeklyArticle: WithDocumentType<PublicArticle>;
}) => {
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.articles.fetching
  );

  return (
    <Flex column className={styles.weekly}>
      <Link to="/articles?tag=weekly">
        <h3 className="u-ui-heading">Weekly</h3>
      </Link>

      {(fetching && !weeklyArticle) || !weeklyArticle ? (
        <ArticleItem url="" meta={<></>} />
      ) : (
        <ArticleItem
          key={weeklyArticle.id}
          item={weeklyArticle}
          url={itemUrl(weeklyArticle)}
          meta={renderMeta(weeklyArticle)}
        />
      )}
    </Flex>
  );
};

const Articles = ({
  articles,
}: {
  articles: WithDocumentType<PublicArticle>[];
}) => {
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.articles.fetching
  );

  return (
    <Flex column className={styles.articles}>
      <Link to="/articles">
        <h3 className="u-ui-heading">Artikler</h3>
      </Link>

      <Flex column gap={20}>
        {(fetching && !articles.length) || !articles.length
          ? Array.from({ length: ARTICLES_TO_SHOW }).map((_, index) => (
              <ArticleItem key={index} url="" meta={<></>} />
            ))
          : articles.map((article) => (
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

const NextEventSection = ({ events }: { events: Event[] }) => (
  <Flex column className={styles.registrations}>
    <Link to="/events">
      <h3 className="u-ui-heading">Påmeldinger</h3>
    </Link>

    <NextEvent events={events} />
  </Flex>
);

const PollItem = () => {
  const poll = useAppSelector(selectPinnedPolls)[0];
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.polls.fetching
  );

  return (
    (fetching || poll) && (
      <Flex column className={styles.poll}>
        <Link to="/polls">
          <h3 className="u-ui-heading">Avstemning</h3>
        </Link>

        <Poll poll={poll} truncate={3} />
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

export default replaceUnlessLoggedIn(PublicFrontpage)(Overview);
