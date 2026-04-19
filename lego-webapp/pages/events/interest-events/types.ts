import type { ListEvent } from '~/redux/models/Event';

export const ROW_ORDER = [
  'dineGrupper',
  'denneUken',
  'kommende',
  'tidligere',
] as const;

export type GroupName = (typeof ROW_ORDER)[number];

export type GroupedEvents = Record<GroupName, ListEvent[]>;
