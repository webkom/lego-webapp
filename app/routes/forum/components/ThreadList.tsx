import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { fetchThreadsByForum } from 'app/actions/ForumActions';
import { selectThreadsByForumId } from 'app/reducers/threads';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
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
