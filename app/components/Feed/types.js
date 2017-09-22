// @flow

export type Activity = {
  time: string,
  extraContext: Object,
  actor: string,
  object: string,
  target: string
};

export type AggregatedActivity = {
  id: number,
  verb: string,
  createdAt: string,
  updatedAt: string,
  lastActivity: Activity,
  activities: Array<Activity>,
  activityCount: number,
  actorIds: Array<number>,
  read: boolean,
  seen: boolean,
  context: Object
};
