import moment from 'moment-timezone';
import config from 'app/config';
import type { Moment } from 'moment';

const parseDateValue = (value?: string): Moment => {
  if (value) return moment(value).tz(config.timezone);
  return moment().tz(config.timezone);
};

export default parseDateValue;
