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

type SuggestedCommand = {
  commandId: string;
  pinnedPosition: number | null;
  usageCount: number;
  lastUsed: string;
};

export function fetchCommandSuggestions() {
  return callAPI<{ pinned: any[]; suggested: SuggestedCommand[] }>({
    types: UserCommand.FETCH_SUGGESTIONS,
    endpoint: '/user-commands/suggestions/',
    method: 'GET',
    meta: {
      errorMessage: 'Kunne ikke hente kommandoforslag',
    },
  });
}
