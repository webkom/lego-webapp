import { LendableObjects } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import type { ListLendableObject } from 'app/store/models/LendableObject';

export function fetchAllLendableObjects() {
  return callAPI<ListLendableObject[]>({
    types: LendableObjects.FETCH,
    endpoint: '/lendable-objects/',
    schema: [lendableObjectSchema],
    meta: {
      errorMessage: 'Henting av utlånsobjekter feilet',
    },
    propagateError: true,
  });
}
