export type Activity = {
  activityId: string;
  time: string;
  verb: number;
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
  orderingKey: string;
  context: Record<string, any>;
};

export type TagInfo = {
  link: string;
  text: string;
  notLink: boolean;
  linkableContent: boolean;
};

export type NotificationData = {
  unreadCount: number;
  unseenCount: number;
};
