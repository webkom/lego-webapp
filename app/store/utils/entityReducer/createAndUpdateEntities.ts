import { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';
import { isArray, isEmpty, union } from 'lodash';
import { configWithSSR } from 'app/config';
import { EntityType } from 'app/store/models/Entities';
import {
  isLegoApiAction,
  LegoApiFailureAction,
  LegoApiSuccessAction,
  LegoApiThunkAction,
} from 'app/store/utils/createLegoApiAction';
import {
  EntityReducerState,
  toArray,
} from 'app/store/utils/entityReducer/index';
import mergeObjects from 'app/utils/mergeObjects';
import type { AnyAction } from '@reduxjs/toolkit';

const isNumber = (id) => !isNaN(Number(id)) && !isNaN(parseInt(id, 10));

const addCreateAndUpdateEntitiesReducer = <
  State extends EntityReducerState<unknown>
>(
  builder: ActionReducerMapBuilder<State>,
  fetchTypes: LegoApiThunkAction | LegoApiThunkAction[] = [],
  key: EntityType
) => {
  builder.addMatcher(
    (
      action: AnyAction
    ): action is LegoApiSuccessAction | LegoApiFailureAction =>
      isLegoApiAction(action) && !!action.payload,
    (state, action) => {
      const isPrimaryKey = action.meta?.schemaKey === key;
      const result = action.payload.entities?.[key] || {};

      /*
       * isPrimaryKey is true if the action schema key is the same as the key specified by createEntityReducer.
       * Ex: Article.FETCH.SUCCESS fetches articles, the payload.result is used rather
       * than looping over the object keys for ordering purposes.
       */
      let resultIds = isPrimaryKey
        ? action.payload.result || []
        : Object.keys(result).map((i) => (isNumber(i) ? parseInt(i, 10) : i));

      const actionGrant: string[] =
        isPrimaryKey && isArray(resultIds)
          ? action.payload.actionGrant || []
          : [];

      if (!isArray(resultIds)) {
        resultIds = [resultIds];
      }

      if (
        isEmpty(result) &&
        !isEmpty(actionGrant) &&
        !toArray(fetchTypes).some(
          (fetchType) => action.type === fetchType.success.type
        )
      ) {
        return;
      }

      state.byId = mergeObjects(state.byId, result);
      state.items = union(state.items, resultIds);
      state.actionGrant = union(state.actionGrant, actionGrant);

      if (!isPrimaryKey || action.cached) {
        return;
      }

      const queryString = action.meta?.queryString;

      if (queryString !== undefined) {
        const nextPage =
          action.payload.next &&
          action.payload.next.replace(configWithSSR.serverUrl, '');

        state.pagination[queryString] = {
          queryString,
          nextPage,
        };

        if (action.meta.paginationKey) {
          state.paginationNext[action.meta.paginationKey] = {
            ...state.paginationNext[action.meta.paginationKey],
            items: union(
              state.paginationNext[action.meta.paginationKey].items,
              resultIds
            ),
          };
        }
      }
    }
  );
};

export default addCreateAndUpdateEntitiesReducer;
