import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicEvent } from '~/redux/models/Event';

export interface Penalty {
  id: EntityId;
  createdAt: Dateish;
  user: EntityId;
  reason: string;
  weight: number;
  sourceEvent: PublicEvent;
  exactExpiration: Dateish;
}

export default Penalty;
