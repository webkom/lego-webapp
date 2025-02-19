import { Flex, LinkButton, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { MessageSquareDashed } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { fetchForums } from 'app/actions/ForumActions';
import EmptyState from 'app/components/EmptyState';
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
      <Helmet title="Forum" />
      {!forums.length && (
        <EmptyState
          iconNode={<MessageSquareDashed />}
          header="Her var det tomt ..."
          body="Opprett et nytt forum da vel!"
        />
      )}
      {forums.length > 0 && (
        <Flex column>
          {forums.map((forum: PublicForum) => (
            <ForumListEntry forum={forum} key={forum.id} />
          ))}
        </Flex>
      )}
      <LoadingIndicator loading={fetching} />
    </Page>
  );
};

export default ForumList;
