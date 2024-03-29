import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { fetchThreadByForum } from 'app/actions/ForumActions';
import { CommentView } from 'app/components/Comments';
import { Content, ContentMain } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { useCurrentUser } from 'app/reducers/auth';
import { selectCommentsByIds } from 'app/reducers/comments';
import { selectThreadById } from 'app/reducers/threads';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { DetailedThread } from 'app/store/models/Forum';

type ThreadDetailParams = {
  forumId: string;
  threadId: string;
};

const ThreadDetail = () => {
  const { forumId, threadId } =
    useParams<ThreadDetailParams>() as ThreadDetailParams;
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  usePreparedEffect(
    'fetchDetailThread',
    () =>
      threadId && forumId && dispatch(fetchThreadByForum(forumId, threadId)),
    [threadId],
  );

  const thread = useAppSelector((state) =>
    selectThreadById<DetailedThread>(state, threadId),
  );

  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, thread?.comments),
  );

  const detailActionGrant = thread?.actionGrant;

  return (
    thread &&
    detailActionGrant && (
      <Content>
        <ContentMain>
          <NavigationTab
            back={{
              label: 'Tilbake til liste',
              path: `/forum/${thread.forum}/threads`,
            }}
          >
            {((currentUser && thread.createdBy?.id === currentUser.id) ||
              detailActionGrant.includes('edit')) && (
              <NavigationLink to={`/forum/${forumId}/threads/${threadId}/edit`}>
                Rediger
              </NavigationLink>
            )}
          </NavigationTab>
          <h1>{thread.title}</h1>
          <DisplayContent content={thread.content} />
          <p>
            Tråd startet{' '}
            {thread.createdBy && (
              <span>
                av{' '}
                <Link to={`/users/${thread.createdBy?.username}`}>
                  {thread.createdBy?.fullName}
                </Link>
              </span>
            )}{' '}
            den {moment(thread?.createdAt).format('lll')}
          </p>
          {comments && (
            <CommentView
              contentTarget={thread.contentTarget}
              comments={comments}
              contentAuthors={thread.createdBy}
              newOnTop
            />
          )}
        </ContentMain>
      </Content>
    )
  );
};

export default ThreadDetail;
