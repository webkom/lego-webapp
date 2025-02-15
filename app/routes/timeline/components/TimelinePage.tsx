import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { Helmet } from 'react-helmet-async';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import Feed from 'app/components/Feed';
import { selectFeedById } from 'app/reducers/feeds';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const TimelinePage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchTimeline', () => dispatch(fetchPersonalFeed()), []);

  const feed = useAppSelector((state) => selectFeedById(state, 'personal'));

  return (
    <Page title="Tidslinje">
      <Helmet title="Tidslinje" />
      {feed ? <Feed feedId={feed.id} /> : <LoadingIndicator loading />}
    </Page>
  );
};

export default guardLogin(TimelinePage);
