import { Container, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// import Banner from 'app/components/Banner';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
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

const Overview = () => {
  const [eventsToShow, setEventsToShow] = useState(9);
  const [articlesToShow, setArticlesToShow] = useState(2);

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
      Promise.all([
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

  const pinnedComponent = pinned && (
    <Pinned item={pinned} url={itemUrl(pinned)} meta={renderMeta(pinned)} />
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
      {/* <Banner
        header="Abakusrevyen har opptak!"
        subHeader="Søk her"
        link="https://opptak.abakus.no"
        color="red"
      /> */}
      <Flex className={styles.desktopContainer}>
        <Flex column className={styles.leftColumn}>
          <CompactEvents events={events} />
          {pinnedComponent}
          <Events events={eventsShown} loggedIn={loggedIn} />
        </Flex>
        <Flex column className={styles.rightColumn}>
          <NextEventSection events={events} />
          <PollItem />
          <QuoteItem />
          {readMe}
          <Weekly weeklyArticle={weeklyArticle} />
          <Articles articles={articlesShown} />
        </Flex>
      </Flex>
      <section className={styles.mobileContainer}>
        <CompactEvents events={events} />
        <NextEvent events={events} />
        {pinnedComponent}
        <PollItem />
        <QuoteItem />
        {readMe}
        <Weekly weeklyArticle={weeklyArticle} />
        <Articles articles={articlesShown} />
        <Events events={eventsShown} loggedIn={loggedIn} />
      </section>

      {frontpage.length > 8 && (
        <div className={styles.showMore}>
          <Icon onClick={showMore} name="chevron-down-outline" size={30} />
        </div>
      )}
    </Container>
  );
};

const Events = ({
  events,
  loggedIn,
}: {
  events: WithDocumentType<Event>[];
  loggedIn: boolean;
}) => (
  <Flex column className={styles.events}>
    <Link to="/events">
      <h3 className="u-ui-heading">Arrangementer</h3>
    </Link>

    <Flex column gap={20}>
      {events.map((event) => (
        <EventItem
          key={event.id}
          item={event}
          url={itemUrl(event)}
          meta={renderMeta(event)}
          loggedIn={loggedIn}
          isFrontPage={true}
        />
      ))}
    </Flex>
  </Flex>
);

const Weekly = ({
  weeklyArticle,
}: {
  weeklyArticle: WithDocumentType<PublicArticle>;
}) => (
  <Flex column>
    {weeklyArticle && (
      <>
        <Link to="/articles?tag=weekly">
          <h3 className="u-ui-heading">Weekly</h3>
        </Link>

        <ArticleItem
          key={weeklyArticle.id}
          item={weeklyArticle}
          url={itemUrl(weeklyArticle)}
          meta={renderMeta(weeklyArticle)}
        />
      </>
    )}
  </Flex>
);
const Articles = ({
  articles,
}: {
  articles: WithDocumentType<PublicArticle>[];
}) => (
  <Flex column>
    <Link to="/articles">
      <h3 className="u-ui-heading">Artikler</h3>
    </Link>

    <Flex column gap={20}>
      {articles.map((article) => (
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

const NextEventSection = ({ events }: { events: Event[] }) => (
  <Flex column>
    <Link to="/events">
      <h3 className="u-ui-heading">Påmeldinger</h3>
    </Link>

    <NextEvent events={events} />
  </Flex>
);

const PollItem = () => {
  const poll = useAppSelector(selectPinnedPolls)[0];

  return (
    <Flex column>
      {poll && (
        <>
          <Link to="/polls">
            <h3 className="u-ui-heading">Avstemning</h3>
          </Link>

          <Poll poll={poll} truncate={3} />
        </>
      )}
    </Flex>
  );
};

const QuoteItem = () => (
  <Flex column>
    <Link to="/quotes">
      <h3 className="u-ui-heading">Overhørt</h3>
    </Link>

    <RandomQuote />
  </Flex>
);

export default replaceUnlessLoggedIn(PublicFrontpage)(Overview);
