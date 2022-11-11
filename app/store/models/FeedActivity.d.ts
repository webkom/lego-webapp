import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface Activity {
  activityId: ID;
  verb: number;
  time: Dateish;
  extraContext: Record<string, string>;
  actor: ContentTarget;
  object: ContentTarget;
  target: ContentTarget;
}

export default interface FeedActivity {
  id: ID;
  orderingKey: string;
  verb: string;
  createdAt: Dateish;
  updatedAt: Dateish;
  lastActivity: Activity;
  activities: Activity[];
  activityCount: number;
  actorIds: ID[];
  read: boolean;
  seen: boolean;
}
