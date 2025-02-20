import moment from 'moment-timezone';
import { appConfig } from '~/utils/appConfig';
import type { Dateish } from 'app/models';
import type { Moment } from 'moment-timezone';

const parseDateValue = (value?: Dateish): Moment => {
  if (value) return moment(value).tz(appConfig.timezone);
  return moment().tz(appConfig.timezone);
};

export default parseDateValue;
