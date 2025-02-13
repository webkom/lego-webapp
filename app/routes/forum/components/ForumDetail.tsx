import { LinkButton, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router';
import { fetchForum } from 'app/actions/ForumActions';
import { selectForumById } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import ThreadList from './ThreadList';
import type { DetailedForum } from 'app/store/models/Forum';

type ForumDetailParams = {
  forumId: string;
};
const ForumDetail = () => {
  const { forumId } = useParams<ForumDetailParams>() as ForumDetailParams;
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailForum',
    () => forumId && dispatch(fetchForum(forumId)),
    [forumId],
  );

  const forum = useAppSelector((state) =>
    selectForumById<DetailedForum>(state, forumId),
  );
  const detailActionGrant = forum?.actionGrant;

  if (!forum || !detailActionGrant) {
    return <LoadingIndicator loading />;
  }

  return (
    <Page
      title={forum.title}
      back={{
        href: '/forum',
      }}
      actionButtons={[
        detailActionGrant.includes('edit') && (
          <LinkButton key="edit" href={`/forum/${forumId}/edit`}>
            Rediger
          </LinkButton>
        ),
        <LinkButton key="create" href={`/forum/${forumId}/new`}>
          Oprett tråd
        </LinkButton>,
      ]}
    >
      <p className="secondaryFontColor">{forum.description}</p>
      <ThreadList forumId={forumId} />
    </Page>
  );
};

export default ForumDetail;
