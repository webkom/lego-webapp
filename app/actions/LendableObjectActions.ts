import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import type {
  EntityType,
  NormalizedEntityPayload,
} from 'app/store/models/entities';
import type { Thunk } from 'app/types';
import { LendableObject } from './ActionTypes';

export function fetchAllLendableObjects(): Thunk<
  Promise<NormalizedEntityPayload<EntityType.LendableObjects>>
> {
  return callAPI({
    types: LendableObject.FETCH,
    endpoint: '/lendableobject/',
    schema: [lendableObjectSchema],
    meta: {
      errorMessage: 'Henting av utlånsobjekter failet',
    },
    propagateError: true,
  });
}

export function fetchLendableObject(id: number): Thunk<any> {
  return callAPI({
    types: LendableObject.FETCH,
    endpoint: `/lendableobject/${id}/`,
    schema: lendableObjectSchema,
    meta: {
      errorMessage: 'Henting av utlånsobjekt feilet',
    },
    propagateError: true,
  });
}

export function deleteLendableObject(id: number): Thunk<any> {
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

export function createLendableObject(data: any): Thunk<any> {
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
}: Record<string, any>): Thunk<any> {
  return callAPI({
    types: LendableObject.EDIT,
    endpoint: `/lendableobject/${id}/`,
    method: 'PUT',
    body: data,
    meta: {
      errorMessage: 'Endring av utlånsobjekt feilet',
    },
  });
}
