import { combineReducers } from '@reduxjs/toolkit';
import allowed from './slices/allowed';

export const createRootReducer = () => combineReducers({ allowed });

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
