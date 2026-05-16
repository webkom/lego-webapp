import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '~/redux/createStore';
import type { RootState } from '~/redux/rootReducer';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
