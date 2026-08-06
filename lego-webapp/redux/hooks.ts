import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, Store } from '~/redux/createStore';
import type { RootState } from '~/redux/rootReducer';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<Store>();
