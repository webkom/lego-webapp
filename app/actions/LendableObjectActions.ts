import { LendableObjects } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import type { ListLendableObject } from 'app/store/models/LendableObject';

export const fetchAllLendableObjects = () =>
  callAPI<ListLendableObject[]>({
    types: LendableObjects.FETCH,
    endpoint: '/lending/objects/',
    schema: [lendableObjectSchema],
    meta: {
      errorMessage: 'Henting av utlånsobjekter feilet',
    },
    propagateError: true,
  });
