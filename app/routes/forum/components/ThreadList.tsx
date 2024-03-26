import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchThreadsByForum } from 'app/actions/ForumActions';
import { Content, ContentMain } from 'app/components/Content';
import { selectThreadsByForumId } from 'app/reducers/threads';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ThreadListEntry from './ThreadListEntry';
import type { ID } from 'app/store/models';

const ThreadList = ({ forumId }: { forumId: ID }) => {
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
      <Content>
        <ContentMain>
          <h1>Tråder 🧶</h1>
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
        </ContentMain>
      </Content>
    </LoadingIndicator>
  );
};

export default ThreadList;
