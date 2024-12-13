import moment from 'moment-timezone';
import config from 'app/config';
import type { Dateish } from 'app/models';
import type { Moment } from 'moment';

const parseDateValue = (value?: Dateish): Moment => {
  if (value) return moment(value).tz(config.timezone);
  return moment().tz(config.timezone);
};

export default parseDateValue;
