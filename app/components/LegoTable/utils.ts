import { isNotNullish } from 'app/utils';
import type {
  ColumnFilter,
  ColumnFiltersState,
  Updater,
} from '@tanstack/react-table';

export const searchParamsToColumnFilters = (
  query: Record<string, string>,
): ColumnFilter[] =>
  Object.entries(query)
    .map(([id, value]) =>
      value
        ? {
            id,
            value: value.includes('&') ? value.split('&') : value,
          }
        : undefined,
    )
    .filter(isNotNullish);

export const columnFiltersToSearchParams = (
  updaterOrValue: Updater<ColumnFiltersState>,
  oldColumnFilters: ColumnFiltersState,
): Record<string, string> => {
  const columnFilters =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(oldColumnFilters)
      : updaterOrValue;

  return columnFilters.reduce(
    (sp, columnFilter) => ({
      ...sp,
      [columnFilter.id]:
        typeof columnFilter.value === 'object'
          ? (columnFilter.value as string[]).join('&')
          : columnFilter.value,
    }),
    {},
  );
};
