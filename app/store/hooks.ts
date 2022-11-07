import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store/rootReducer';
import { AppDispatch } from 'app/store/store';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
