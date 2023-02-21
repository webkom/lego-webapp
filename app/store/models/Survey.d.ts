import type { Dateish } from 'app/models';
import type { EventType } from 'app/store/models/Event';
import type { ID } from 'app/store/models/index';

interface Survey {
  id: ID;
  title: string;
  activeFrom: Dateish;
  event: ID;
  templateType: EventType | null;
}
