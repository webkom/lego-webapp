import { isAsyncApiActionSuccess } from '~/redux/legoAdapter/asyncApiActions';
import type {
  EntityAdapter,
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type Entities from '~/redux/models/entities';
import type { EntityType } from '~/redux/models/entities';

const buildEntitiesReducer = <
  T extends EntityType,
  Id extends EntityId,
  Entity extends Entities[T][Id] = Entities[T][Id],
>(
  builder: ActionReducerMapBuilder<EntityState<Entity, Id>>,
  adapter: EntityAdapter<Entity, Id>,
  entityType: T,
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.containingEntity(entityType),
    (state, action) => {
      adapter.upsertMany(
        state,
        action.payload.entities[entityType] as Record<EntityId, Entity>,
      );
    },
  );
};

export default buildEntitiesReducer;
