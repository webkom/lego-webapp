import type { ID } from 'app/store/models/index';

export default interface FetchEntityPayload<Entity> {
  result: ID[];
  entities: Record<ID, Entity>;
  next: null | string;
  previous: null | string;
}
