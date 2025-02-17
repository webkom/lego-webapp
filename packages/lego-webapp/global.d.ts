import { Store } from './redux/createStore';
import { RootState } from './redux/rootReducer';

declare global {
  namespace Vike {
    interface PageContext {
      store: Store;
      storeInitialState: RootState;
    }
  }
}
