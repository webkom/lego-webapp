import type Config from '../config/Config';
import type {
  SearchFilterOptions,
  SelectFilterOptions,
} from 'app/components/LegoTable/FilterButton';
import type { RootState } from 'app/store/createRootReducer';

declare global {
  const __DEV__: boolean;
  const __CLIENT__: boolean;

  interface Window {
    __CONFIG__?: Config;
    __PRELOADED_STATE__?: RootState | Record<string, never>;
    __IS_SSR__?: boolean;
  }
}

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta {
    filter?: SearchFilterOptions | SelectFilterOptions;
  }
}

export {};
