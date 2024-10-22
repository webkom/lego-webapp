import { LendableObjects } from 'app/actions/ActionTypes';
import callAPI from 'app/actions/callAPI';
import { lendableObjectSchema } from 'app/reducers';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailLendableObject,
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
