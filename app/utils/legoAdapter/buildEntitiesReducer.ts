import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type { EntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';

const buildEntitiesReducer = <
  T extends EntityType,
  Entity extends Entities[T][ID] = Entities[T][ID]
>(
  builder: ActionReducerMapBuilder<EntityState<Entity>>,
  adapter: EntityAdapter<Entity>,
  entityType: T
) => {
  builder.addMatcher(
    isAsyncApiActionSuccess.containingEntity(entityType),
    (state, action) => {
      // typescript is not quite able to infer this type on its own
      const payloadEntities = action.payload.entities[entityType] as Record<
        ID,
        Entity
      >;
      adapter.upsertMany(state, payloadEntities);
    }
  );
};

export default buildEntitiesReducer;
