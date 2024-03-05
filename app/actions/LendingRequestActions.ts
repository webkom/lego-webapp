import type { Thunk } from 'app/types';
import type { EntityType, NormalizedEntityPayload } from 'app/store/models/entities';
import callAPI from 'app/actions/callAPI';
import { LendingRequest } from 'app/actions/ActionTypes';
import { lendingRequestSchema } from 'app/reducers';

export function fetchAllLendingRequests(): Thunk<
  Promise<NormalizedEntityPayload<EntityType.LendingRequests>>
> {
  return callAPI({
    types: LendingRequest.FETCH,
    endpoint: '/lendinginstance/',
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler failet',
    },
    propagateError: true,
  });
}

export function createLendingRequest(data: any): Thunk<any> {
  return callAPI({
    types: LendingRequest.CREATE,
    endpoint: '/lendinginstance/',
    method: 'POST',
    body: data,
    schema: lendingRequestSchema,
    meta: {
      errorMessage: 'Opprettelse av utlånsforespørsel feilet',
    },
  });
}