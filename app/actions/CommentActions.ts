import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/Entities';
import { commentSchema } from 'app/store/schemas';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';

interface AddCommentArgs {
  text: string;
  contentTarget: ContentTarget;
  parent?: ID;
}

export const addComment = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Comments>
>()('Comment.ADD', (_, { text, contentTarget, parent }: AddCommentArgs) => ({
  endpoint: '/comments/',
  method: 'POST',
  body: {
    text,
    content_target: contentTarget,
    ...(parent
      ? {
          parent,
        }
      : {}),
  },
  meta: {
    contentTarget,
    errorMessage: 'Kommentering feilet',
  },
  schema: commentSchema,
}));

export const deleteComment = createLegoApiAction()(
  'Comment.DELETE',
  (_, id: ID, contentTarget: ContentTarget) => ({
    endpoint: `/comments/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      contentTarget,
      errorMessage: 'Sletting av kommentar feilet',
      successMessage: 'Kommentar slettet',
    },
  })
);
