import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import Feed from 'app/components/Feed';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { fetchPersonalFeed } from '~/redux/actions/FeedActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectFeedById } from '~/redux/slices/feeds';

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
