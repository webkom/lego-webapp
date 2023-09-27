import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import { Content } from 'app/components/Content';
import Feed from 'app/components/Feed';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectFeedActivitesByFeedId,
  selectFeedById,
} from 'app/reducers/feeds';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const TimelinePage = () => {
  const { loggedIn } = useUserContext();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchTimeline',
    () => {
      loggedIn && dispatch(fetchPersonalFeed());
    },
    [loggedIn]
  );

  const feed = useAppSelector((state) =>
    selectFeedById(state, {
      feedId: 'personal',
    })
  );

  const feedItems = useAppSelector((state) =>
    selectFeedActivitesByFeedId(state, {
      feedId: 'personal',
    })
  );

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <Content>
      <Helmet title="Tidslinje" />
      <h1>Tidslinje</h1>

      {feed ? <Feed items={feedItems} /> : <LoadingIndicator loading />}
    </Content>
  );
};

export default TimelinePage;
