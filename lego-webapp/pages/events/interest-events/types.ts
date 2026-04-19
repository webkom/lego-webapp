import type { EntityId } from '@reduxjs/toolkit';
import type { ListEvent } from '~/redux/models/Event';

export type EventWithResponsibleGroup = ListEvent & {
  responsibleGroup?: {
    id: EntityId;
    name: string;
  };
};

export const ROW_ORDER = [
  'dineGrupper',
  'denneUken',
  'kommende',
  'tidligere',
] as const;

export type GroupName = (typeof ROW_ORDER)[number];

export type GroupedEvents = Record<GroupName, EventWithResponsibleGroup[]>;
