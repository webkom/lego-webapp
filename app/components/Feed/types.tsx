export interface Activity {
  time: string;
  extraContext: Object;
  actor: string;
  object: string;
  target: string;
}

export interface AggregatedActivity {
  id: number;
  verb: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: Activity;
  activities: Array<Activity>;
  activityCount: number;
  actorIds: Array<string>;
  read: boolean;
  seen: boolean;
  context: Object;
}

export interface TagInfo {
  link: string;
  text: string;
  notLink: boolean;
  linkableContent: boolean;
}
