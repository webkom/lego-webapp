import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type { EntityAdapter, EntityId } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';

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
      adapter.upsertMany(state, action.payload.entities[entityType]);
    },
  );
};

export default buildEntitiesReducer;
