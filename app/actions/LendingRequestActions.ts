import { LendingRequest } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendingRequestSchema } from 'app/reducers';
import type {
  EntityType,
  NormalizedEntityPayload,
} from 'app/store/models/entities';
import type { Thunk } from 'app/types';

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

export function fetchLendingRequest(
  id: number,
): Thunk<Promise<NormalizedEntityPayload<EntityType.LendingRequest>>> {
  return callAPI({
    types: LendingRequest.FETCH,
    endpoint: `/lendinginstance/${id}/`,
    schema: lendingRequestSchema,
    meta: {
      errorMessage: 'Henting av utlånsforespørsel feilet',
    },
  });
}

export function fetchLendingRequestsForLendableObject(
  lendableObjectId: number,
): Thunk<Promise<NormalizedEntityPayload<EntityType.LendingRequests>>> {
  return callAPI({
    types: LendingRequest.FETCH,
    endpoint: `/lendableobject/${lendableObjectId}/lendinginstances/`,
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
  });
}

export function createLendingRequest(data: any) {
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
