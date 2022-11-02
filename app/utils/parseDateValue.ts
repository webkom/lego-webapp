import moment from 'moment-timezone';
import config from 'app/config';

const parseDateValue = (value) => {
  if (value) return moment(value).tz(config.timezone);
  return moment().tz(config.timezone);
};

export default parseDateValue;
