import { LendingRequests } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendingRequestSchema } from 'app/reducers';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  AdminLendingRequest,
  CreateLendingRequest,
  EditLendingRequest,
  ListLendingRequest,
} from 'app/store/models/LendingRequest';

export const fetchLendingRequests = () =>
  callAPI<ListLendingRequest[]>({
    types: LendingRequests.FETCH,
    endpoint: '/lending/requests/',
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
    propagateError: true,
  });

export const fetchLendingRequestsAdmin = () =>
  callAPI<AdminLendingRequest[]>({
    types: LendingRequests.FETCH_ADMIN,
    endpoint: '/lending/requests/admin/',
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
    propagateError: true,
  });

export const fetchLendingRequestById = (id: EntityId) =>
  callAPI<ListLendingRequest>({
    types: LendingRequests.FETCH,
    endpoint: `/lending/requests/${id}/`,
    schema: lendingRequestSchema,
    meta: {
      errorMessage: 'Henting av utlånsforespørsel feilet',
    },
    propagateError: true,
  });

export const editLendingRequest = (data: EditLendingRequest) =>
  callAPI<ListLendingRequest>({
    types: LendingRequests.EDIT,
    endpoint: `/lending/requests/${data.id}/`,
    method: 'PUT',
    schema: lendingRequestSchema,
    body: data,
    meta: {
      errorMessage: 'Endring av utlånsforespørsel feilet',
    },
  });

export const createLendingRequest = (data: CreateLendingRequest) =>
  callAPI<ListLendingRequest>({
    types: LendingRequests.CREATE,
    endpoint: '/lending/requests/',
    method: 'POST',
    schema: lendingRequestSchema,
    body: data,
    meta: {
      errorMessage: 'Opprettelse av utlånsforespørsel feilet',
    },
  });
