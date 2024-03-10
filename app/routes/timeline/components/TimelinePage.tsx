import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import { Content } from 'app/components/Content';
import Feed from 'app/components/Feed';
import { selectFeedById } from 'app/reducers/feeds';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const TimelinePage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchTimeline', () => dispatch(fetchPersonalFeed()), []);

  const feed = useAppSelector((state) => selectFeedById(state, 'personal'));

  return (
    <Content>
      <Helmet title="Tidslinje" />
      <h1>Tidslinje</h1>

      {feed ? <Feed feedId={feed.id} /> : <LoadingIndicator loading />}
    </Content>
  );
};

export default guardLogin(TimelinePage);
