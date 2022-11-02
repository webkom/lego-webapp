export type Activity = {
  time: string;
  extraContext: Record<string, any>;
  actor: string;
  object: string;
  target: string;
};
export type AggregatedActivity = {
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
  context: Record<string, any>;
};
export type TagInfo = {
  link: string;
  text: string;
  notLink: boolean;
  linkableContent: boolean;
};