import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router-dom';
import { fetchForum } from 'app/actions/ForumActions';
import { Content, ContentMain } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectForumsById } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ThreadList from './ThreadList';
import type { DetailedForum } from 'app/store/models/Forum';

const ForumDetail = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailForum',
    () => forumId && dispatch(fetchForum(forumId)),
    [forumId],
  );

  const forum: DetailedForum = useAppSelector((state) =>
    selectForumsById(state, { forumId }),
  );
  const detailActionGrant = forum?.actionGrant;

  return (
    forum &&
    detailActionGrant && (
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
    )
  );
};

export default ForumDetail;
