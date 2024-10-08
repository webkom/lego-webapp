import { entitiesReceived } from 'app/utils/legoAdapter/actions';
import { isAsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';
import type {
  EntityAdapter,
  EntityId,
  EntityState,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
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
  builder.addMatcher(entitiesReceived.match, (state, { payload }) => {
    if (payload[entityType])
      adapter.upsertMany(state, payload[entityType] as Record<Id, Entity>);
  });
};

export default buildEntitiesReducer;
