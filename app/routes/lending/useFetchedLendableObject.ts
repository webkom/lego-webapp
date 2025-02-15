import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { useState } from 'react';
import { fetchLendableObjectById } from 'app/actions/LendableObjectActions';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailLendableObject,
  UnknownLendableObject,
} from 'app/store/models/LendableObject';

export const useFetchedLendableObject = (lendableObjectId: EntityId) => {
  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState(true);

  usePreparedEffect(
    'fetchLendableObjectById',
    () =>
      dispatch(fetchLendableObjectById(lendableObjectId)).then(() =>
        setFetching(false),
      ),
    [lendableObjectId],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId!),
  );

  return { lendableObject, fetching } as
    | {
        lendableObject?: UnknownLendableObject;
        fetching: true;
      }
    | {
        lendableObject: DetailLendableObject;
        fetching: false;
      };
};
