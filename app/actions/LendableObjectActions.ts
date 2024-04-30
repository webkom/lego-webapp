import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import { LendableObject } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedLendableObject, ListLendableObject } from 'app/store/models/LendableObject';

export function fetchAllLendableObjects() {
  return callAPI<ListLendableObject[]>({
    types: LendableObject.FETCH,
    endpoint: '/lendableobject/',
    schema: [lendableObjectSchema],
    meta: {
      errorMessage: 'Henting av utlånsobjekter feilet',
    },
    propagateError: true,
  });
}

export function fetchLendableObject(id: EntityId) {
  return callAPI<DetailedLendableObject>({
    types: LendableObject.FETCH,
    endpoint: `/lendableobject/${id}/`,
    schema: lendableObjectSchema,
    meta: {
      errorMessage: 'Henting av utlånsobjekt feilet',
    },
    propagateError: true,
  });
}

export function deleteLendableObject(id: EntityId) {
  return callAPI({
    types: LendableObject.DELETE,
    endpoint: `/lendableobject/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av utlånsobjekt feilet',
    },
  });
}

export function createLendableObject(data) {
  return callAPI({
    types: LendableObject.CREATE,
    endpoint: '/lendableobject/',
    method: 'POST',
    body: data,
    schema: lendableObjectSchema,
    meta: {
      errorMessage: 'Opprettelse av utlånsobjekt feilet',
    },
  });
}

export function editLendableObject({
  id,
  ...data
}) {
  return callAPI({
    types: LendableObject.EDIT,
    endpoint: `/lendableobject/${id}/`,
    method: 'PATCH',
    body: data,
    meta: {
      errorMessage: 'Endring av utlånsobjekt feilet',
    },
  });
}
