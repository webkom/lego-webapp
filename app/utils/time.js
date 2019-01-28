// @flow
import moment from 'moment-timezone';

export const time = (
  timeObject: { days?: number, hours?: number, minutes?: number } = {}
) =>
  moment()
    .startOf('day')
    .add(timeObject)
    .toISOString();
