import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import { Content } from 'app/components/Content';
import Feed from 'app/components/Feed';
import {
  selectFeedActivitesByFeedId,
  selectFeedById,
} from 'app/reducers/feeds';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const TimelinePage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchTimeline',
    () => {
      dispatch(fetchPersonalFeed());
    },
    []
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

  return (
    <Content>
      <Helmet title="Tidslinje" />
      <h1>Tidslinje</h1>

      {feed ? <Feed items={feedItems} /> : <LoadingIndicator loading />}
    </Content>
  );
};

export default guardLogin(TimelinePage);
