import { LendingRequest } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendingRequestSchema } from 'app/reducers';
import type { LendingRequest as LendingRequestModel } from 'app/store/models/LendingRequest.ts';

export function fetchAllLendingRequests() {
  return callAPI<LendingRequestModel>({
    types: LendingRequest.FETCH,
    endpoint: '/lendinginstance/',
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
    propagateError: true,
  });
}

export function fetchLendingRequest(
  id: number,
) {
  return callAPI<LendingRequestModel>({
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
) {
  return callAPI<LendingRequestModel>({
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
