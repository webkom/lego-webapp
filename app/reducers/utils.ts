import type { RootState } from 'app/store/createRootReducer';

export const asArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

/**
 * Allows the selector to specify a more specific type for the entity. F.ex. DetailedEvent instead of UnknownEvent.
 * Whether it selects a single entity or an array of entities is inferred from given base type, so any selector selecting multiple should specify it as an array of the UnkownEntity type.
 */
export type TypeableEntitySelector<BaseEntityType, Args extends unknown[]> = <
  T extends BaseEntityType extends Array<unknown>
    ? BaseEntityType[number]
    : BaseEntityType,
>(
  state: RootState,
  ...args: Args
) => BaseEntityType extends Array<unknown> ? T[] : T | undefined;
