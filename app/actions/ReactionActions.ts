import type { ID } from 'app/models';
import Entities, { EntityType } from 'app/store/models/Entities';
import { reactionSchema } from 'app/store/schemas';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

interface AddReactionArgs {
  emoji: string;
  contentTarget: ContentTarget;
  unicodeString: string;
}

interface AddReactionSuccessPayload {
  result: ID;
  entities: Pick<Entities, EntityType.Reactions>;
}

export const addReaction = createLegoApiAction<
  AddReactionSuccessPayload,
  unknown
>()(
  'Reaction.ADD',
  (_, { contentTarget, emoji, unicodeString }: AddReactionArgs) => ({
    endpoint: '/reactions/',
    method: 'POST',
    body: {
      emoji,
      content_target: contentTarget,
    },
    meta: {
      errorMessage: 'Reaksjon feilet',
      emoji,
      contentTarget,
      unicodeString,
    },
    schema: reactionSchema,
  })
);

interface DeleteReactionArgs {
  reactionId: ID;
  contentTarget: ContentTarget;
}

export const deleteReaction = createLegoApiAction()(
  'Reaction.DELETE',
  (_, { reactionId, contentTarget }: DeleteReactionArgs) => ({
    endpoint: `/reactions/${reactionId}/`,
    method: 'DELETE',
    meta: {
      id: reactionId,
      contentTarget,
      errorMessage: 'Sletting av reaksjon feilet',
    },
  })
);
