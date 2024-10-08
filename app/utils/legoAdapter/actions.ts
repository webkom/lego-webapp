import { createAction } from '@reduxjs/toolkit';
import type Entities from 'app/store/models/entities';

export const entitiesReceived = createAction<Partial<Entities>>(
  'legoEntitiesReceived',
);
