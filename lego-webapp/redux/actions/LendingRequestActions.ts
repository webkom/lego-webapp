import {
  AdminLendingRequest,
  CreateLendingRequest,
  EditLendingRequest,
  ListLendingRequest,
} from '~/redux/models/LendingRequest';
import { LendingRequests } from '../actionTypes';
import { lendingRequestSchema } from '../schemas';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';

export const fetchLendingRequests = ({ next = false }) =>
  callAPI<ListLendingRequest[]>({
    types: LendingRequests.FETCH,
    endpoint: '/lending/requests/',
    schema: [lendingRequestSchema],
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
    pagination: {
      fetchNext: next,
    },
    propagateError: true,
  });

export const fetchLendingRequestsAdmin = ({ query, next = false }) =>
  callAPI<AdminLendingRequest[]>({
    types: LendingRequests.FETCH_ADMIN,
    endpoint: '/lending/requests/admin/',
    schema: [lendingRequestSchema],
    query,
    meta: {
      errorMessage: 'Henting av utlånsforespørsler feilet',
    },
    pagination: {
      fetchNext: next,
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
    method: 'PATCH',
    schema: lendingRequestSchema,
    body: data,
    meta: {
      errorMessage: 'Endring av utlånsforespørsel feilet',
      successMessage: 'Endring av utlånsforespørsel fullført',
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
      successMessage: 'Opprettelse av utlånsforespørsel fullført',
    },
  });
