import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchThreadsByForum } from '~/redux/actions/ForumActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectThreadsByForumId } from '~/redux/slices/threads';
import ThreadListEntry from './ThreadListEntry';
import type { EntityId } from '@reduxjs/toolkit';

const ThreadList = ({ forumId }: { forumId: EntityId }) => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllThreadsByForum',
    () => forumId && dispatch(fetchThreadsByForum(forumId)),
    [forumId],
  );

  const threads = useAppSelector((state) =>
    selectThreadsByForumId(state, Number(forumId)),
  );

  const fetching = useAppSelector((state) => state.threads.fetching);

  return (
    <LoadingIndicator loading={fetching}>
      <h2>Tråder 🧶</h2>
      <Flex column>
        {threads?.map((t) => (
          <ThreadListEntry
            thread={t}
            className={''}
            key={t.id}
            forumId={forumId}
          />
        ))}
      </Flex>
    </LoadingIndicator>
  );
};

export default ThreadList;
