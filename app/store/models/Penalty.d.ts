import type { Dateish } from 'app/models';
import type { PublicEvent } from 'app/store/models/Event';
import type { ID } from 'app/store/models/index';

export interface Penalty {
  id: ID;
  createdAt: Dateish;
  user: ID;
  reason: string;
  weight: number;
  sourceEvent: PublicEvent;
  exactExpiration: Dateish;
}

export default Penalty;
