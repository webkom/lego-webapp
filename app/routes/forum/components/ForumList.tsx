import { Flex, LinkButton, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchForums } from 'app/actions/ForumActions';
import { Tag } from 'app/components/Tags';
import { selectAllForums } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ForumListEntry from './ForumListEntry';
import type { PublicForum } from 'app/store/models/Forum';

const ForumList = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllForums', () => dispatch(fetchForums()), []);

  const forums = useAppSelector(selectAllForums<PublicForum>);
  const fetching = useAppSelector((state) => state.forums.fetching);
  const actionGrant = useAppSelector((state) => state.forums.actionGrant);

  return (
    <Page
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Forum
          <Tag tag="Beta" color="purple" />
        </Flex>
      }
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/forum/new">Nytt forum</LinkButton>
        )
      }
    >
      <Flex column>
        {forums?.map((f: PublicForum) => (
          <ForumListEntry forum={f} key={f.id} />
        ))}
      </Flex>
      <LoadingIndicator loading={fetching} />
    </Page>
  );
};

export default ForumList;
