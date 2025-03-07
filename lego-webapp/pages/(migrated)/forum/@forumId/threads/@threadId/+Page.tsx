import { LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment';
import { CommentView } from '~/components/Comments';
import DisplayContent from '~/components/DisplayContent';
import { fetchThreadByForum } from '~/redux/actions/ForumActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectCommentsByIds } from '~/redux/slices/comments';
import { selectThreadById } from '~/redux/slices/threads';
import { useParams } from '~/utils/useParams';
import type { DetailedThread } from '~/redux/models/Forum';

type ThreadDetailParams = {
  forumId: string;
  threadId: string;
};

const ThreadDetail = () => {
  const { forumId, threadId } = useParams<ThreadDetailParams>();
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
      <Page
        title={thread.title}
        back={{
          href: `/forum/${thread.forum}/threads`,
        }}
        actionButtons={
          ((currentUser && thread.createdBy?.id === currentUser.id) ||
            detailActionGrant.includes('edit')) && (
            <LinkButton href={`/forum/${forumId}/threads/${threadId}/edit`}>
              Rediger
            </LinkButton>
          )
        }
      >
        <DisplayContent content={thread.content} />
        <p>
          Tråd startet{' '}
          {thread.createdBy && (
            <span>
              av{' '}
              <a href={`/users/${thread.createdBy?.username}`}>
                {thread.createdBy?.fullName}
              </a>
            </span>
          )}{' '}
          den {moment(thread?.createdAt).format('lll')}
        </p>
        {comments && (
          <CommentView
            contentTarget={thread.contentTarget}
            comments={comments}
            contentAuthors={thread.createdBy}
          />
        )}
      </Page>
    )
  );
};

export default ThreadDetail;
