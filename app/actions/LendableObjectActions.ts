import { LendableObjects } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  CreateLendableObject,
  DetailLendableObject,
  EditLendableObject,
  ListLendableObject,
} from 'app/store/models/LendableObject';

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

export const fetchLendableObjectById = (id: EntityId) =>
  callAPI<DetailLendableObject>({
    types: LendableObjects.FETCH,
    endpoint: `/lending/objects/${id}/`,
    schema: lendableObjectSchema,
    meta: {
      errorMessage: 'Henting av utlånsobjekt feilet',
    },
    propagateError: true,
  });

export const editLendableObject = (data: EditLendableObject) =>
  callAPI<DetailLendableObject>({
    types: LendableObjects.EDIT,
    endpoint: `/lending/objects/${data.id}/`,
    method: 'PUT',
    schema: lendableObjectSchema,
    body: data,
    meta: {
      errorMessage: 'Endring av utlånsobjekt feilet',
    },
  });

export const createLendableObject = (data: CreateLendableObject) =>
  callAPI<DetailLendableObject>({
    types: LendableObjects.CREATE,
    endpoint: '/lendable-objects/',
    method: 'POST',
    schema: lendableObjectSchema,
    body: data,
    meta: {
      errorMessage: 'Opprettelse av utlånsobjekt feilet',
    },
  });
