import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Banner from 'app/components/Banner';
import Icon from 'app/components/Icon';
import { Container, Flex } from 'app/components/Layout';
import Poll from 'app/components/Poll';
import RandomQuote from 'app/components/RandomQuote';
import type { Event, Readme } from 'app/models';
import type { WithDocumentType } from 'app/reducers/frontpage';
import { isArticle, isEvent } from 'app/reducers/frontpage';
import type { PollEntity } from 'app/reducers/polls';
import type { PublicArticle } from 'app/store/models/Article';
import type { FrontpageEvent } from 'app/store/models/Event';
import ArticleItem from './ArticleItem';
import CompactEvents from './CompactEvents';
import EventItem from './EventItem';
import LatestReadme from './LatestReadme';
import NextEvent from './NextEvent';
import styles from './Overview.css';
import Pinned from './Pinned';
import { itemUrl, renderMeta } from './utils';

type Props = {
  frontpage: WithDocumentType<PublicArticle | FrontpageEvent>[];
  fetchingFrontpage: boolean;
  readmes: Readme[];
  poll: PollEntity | null | undefined;
  votePoll: () => Promise<void>;
  loggedIn: boolean;
};

const Overview = (props: Props) => {
  const [eventsToShow, setEventsToShow] = useState(9);
  const [articlesToShow, setArticlesToShow] = useState(2);

  const showMore = () => {
    setEventsToShow(eventsToShow + 6);
    setArticlesToShow(articlesToShow + 2);
  };

  const { loggedIn, frontpage, readmes, poll, votePoll, fetchingFrontpage } =
    props;

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
      <Banner
        header="Abakus har opptak!"
        subHeader="Søk her"
        link="https://opptak.abakus.no"
        color="red"
      />
      <Flex className={styles.desktopContainer}>
        <Flex column className={styles.leftColumn}>
          <CompactEvents events={events} />
          {pinnedComponent}
          <Events events={eventsShown} loggedIn={loggedIn} />
        </Flex>
        <Flex column className={styles.rightColumn}>
          <NextEventSection events={events} />
          <PollItem poll={poll} votePoll={votePoll} />
          <QuoteItem loggedIn={loggedIn} />
          {readMe}
          <Weekly weeklyArticle={weeklyArticle} />
          <Articles articles={articlesShown} />
        </Flex>
      </Flex>
      <section className={styles.mobileContainer}>
        <CompactEvents events={events} />
        <NextEvent events={events} />
        <PollItem poll={poll} votePoll={votePoll} />
        <QuoteItem loggedIn={loggedIn} />
        {pinnedComponent}
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

const PollItem = ({
  poll,
  votePoll,
}: {
  poll: PollEntity;
  votePoll: (pollId: number) => Promise<void>;
}) => (
  <Flex column>
    {poll && (
      <>
        <Link to="/polls">
          <h3 className="u-ui-heading">Avstemning</h3>
        </Link>

        <Poll poll={poll} truncate={3} handleVote={votePoll} />
      </>
    )}
  </Flex>
);

const QuoteItem = ({ loggedIn }: { loggedIn: boolean }) => (
  <Flex column>
    <Link to="/quotes">
      <h3 className="u-ui-heading">Overhørt</h3>
    </Link>

    <RandomQuote loggedIn={loggedIn} />
  </Flex>
);

export default Overview;
