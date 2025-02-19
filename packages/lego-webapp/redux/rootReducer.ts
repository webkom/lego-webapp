import { combineReducers } from '@reduxjs/toolkit';
import allowed from './slices/allowed';
import test from './slices/test';

export const createRootReducer = () => combineReducers({ allowed, test });

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
