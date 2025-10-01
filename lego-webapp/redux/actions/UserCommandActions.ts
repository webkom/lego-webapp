import { UserCommand } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';

export function recordCommandUsage(updates: Record<string, number>) {
  return callAPI({
    types: UserCommand.RECORD_USAGE,
    endpoint: '/user-commands/bulk_records/',
    method: 'POST',
    body: { updates },
    meta: {
      errorMessage: 'Kunne ikke oppdatere kommando-bruk',
    },
  });
}
