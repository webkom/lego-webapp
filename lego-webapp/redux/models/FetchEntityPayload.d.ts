import type { EntityId } from '@reduxjs/toolkit';

export default interface FetchEntityPayload<Entity> {
  result: EntityId[];
  entities: Record<EntityId, Entity>;
  next: null | string;
  previous: null | string;
}
