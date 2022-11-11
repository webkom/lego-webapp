import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/store/rootReducer';
import type { AppDispatch } from 'app/store/store';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
