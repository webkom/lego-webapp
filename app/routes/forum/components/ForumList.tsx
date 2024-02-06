import { Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchForums } from 'app/actions/ForumActions';
import { Content, ContentMain } from 'app/components/Content';
import { NavigationLink } from 'app/components/NavigationTab';
import { selectForums } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ForumListEntry from './ForumListEntry';
import type { PublicForum } from 'app/store/models/Forum';

const ForumList = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllForums', () => dispatch(fetchForums()), []);

  const forums = useAppSelector((state) => selectForums(state));
  const actionGrant = useAppSelector((state) => state.forums.actionGrant);

  return (
    <Content>
      <ContentMain>
        <h1>Forum</h1>
        {actionGrant.includes('create') && (
          <NavigationLink to="/forum/new">Nytt forum</NavigationLink>
        )}
        <Flex column>
          {forums?.map((f: PublicForum) => (
            <ForumListEntry subForum={f} key={f.id} />
          ))}
        </Flex>
      </ContentMain>
    </Content>
  );
};

export default ForumList;
