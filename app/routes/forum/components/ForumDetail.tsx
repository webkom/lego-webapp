import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router-dom';
import { fetchForum, fetchForums } from 'app/actions/ForumActions';
import { Content, ContentMain } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectForumsById } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ThreadList from './ThreadList';
import type { DetailedForum } from 'app/store/models/Forum';

const ForumDetail = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const dispatch = useAppDispatch();

  //This is needed due to action_grant not being sent on detail action for some reason. Should be fixed.
  usePreparedEffect(
    'fetchAllForums',
    () => forumId && dispatch(fetchForums()),
    [forumId]
  );

  usePreparedEffect(
    'fetchDetailForum',
    () => forumId && dispatch(fetchForum(forumId)),
    [forumId]
  );

  const forum: DetailedForum = useAppSelector((state) =>
    selectForumsById(state, { forumId })
  );
  const actionGrant = useAppSelector((state) => state.forums.actionGrant);

  return (
    forum && (
      <Content>
        <ContentMain>
          <NavigationTab
            back={{
              label: 'Tilbake til liste',
              path: '/forum',
            }}
          >
            {actionGrant.includes('edit') && (
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
          <ThreadList forumId={forumId} threadIds={forum.threads} />
        </ContentMain>
      </Content>
    )
  );
};

export default ForumDetail;
