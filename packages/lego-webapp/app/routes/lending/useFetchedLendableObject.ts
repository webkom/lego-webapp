import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { fetchLendableObjectById } from '~/redux/actions/LendableObjectActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectLendableObjectById } from '~/redux/slices/lendableObjects';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailLendableObject,
  UnknownLendableObject,
} from '~/redux/models/LendableObject';

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
