// @flow

export type Activity = {
  time: string,
  extraContext: Object,
  actor: string,
  object: string,
  target: string,
};

export type AggregatedActivity = {
  id: number,
  verb: string,
  createdAt: string,
  updatedAt: string,
  lastActivity: Activity,
  activities: Array<Activity>,
  activityCount: number,
  actorIds: Array<string>,
  read: boolean,
  seen: boolean,
  context: Object,
};

export type TagInfo = {
  link: string,
  text: string,
  notLink: boolean,
  linkableContent: boolean,
};
