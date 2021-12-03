import zxcvbn from 'zxcvbn';
import { pick } from 'lodash';

export const validPassword =
  (message = 'Passordet er for svakt. Minimum styrke er 3.') =>
  (value, data) => {
    if (value === undefined) {
      return [true];
    }
    const userValues = Object.values(
      pick(data, ['username', 'firstName', 'lastName'])
    );
    const evalPass = zxcvbn(value, userValues);
    return [evalPass.score >= 3, message];
  };
