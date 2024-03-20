import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router-dom';
import { fetchForum } from 'app/actions/ForumActions';
import { Content, ContentMain } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectForumById } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ThreadList from './ThreadList';
import type { DetailedForum } from 'app/store/models/Forum';

type ForumDetailParams = {
  forumId: string;
};
const ForumDetail = () => {
  const { forumId } = useParams<ForumDetailParams>() as ForumDetailParams;
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailForum',
    () => forumId && dispatch(fetchForum(forumId)),
    [forumId],
  );

  const forum = useAppSelector((state) =>
    selectForumById(state, forumId),
  ) as DetailedForum;
  const detailActionGrant = forum?.actionGrant;

  if (!forum || !detailActionGrant) {
    return <LoadingIndicator loading />;
  }

  return (
    <Content>
      <ContentMain>
        <NavigationTab
          back={{
            label: 'Tilbake til liste',
            path: '/forum',
          }}
        >
          {detailActionGrant.includes('edit') && (
            <NavigationLink to={`/forum/${forumId}/edit`}>
              Rediger
            </NavigationLink>
          )}
          <NavigationLink to={`/forum/${forumId}/new`}>
            Oprett tråd
          </NavigationLink>
        </NavigationTab>

        <h1>{forum.title}</h1>
        <p className="secondaryFontColor">{forum.description}</p>
        <ThreadList forumId={forumId} />
      </ContentMain>
    </Content>
  );
};

export default ForumDetail;
