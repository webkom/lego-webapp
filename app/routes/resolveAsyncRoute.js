// @flow

function loadRoute(callback) {
  return module => callback(null, module.default);
}

function loadingError(err) {
  console.error('Loading error', err); // eslint-disable-line
}

type CodeSplittedFn = () => Promise<Object>;
type SyncRequireFn = () => Object;
type AsyncOrSyncRouteConfig =
  | {
      getComponent: (location: string, cb: () => void) => void
    }
  | { component: Object };

/**
 * Utility function for creating React-Router 3 config for async routes using
 * import()-statements while also having the possibility to fallback to sync routes
 * in development for better hot-reloadability.
 *
 * The function requires the import and require statements to be passed in as functions
 * that can be called at appropriate times. We can not simply pass in the path as a string
 * as webpack don't fully support expressions inside these statements to make them
 * statically analyzable.
 *
 *
 * It should be used as follows:
 * ```js
 * resolveAsyncRoute(
 *   () => import('./Route'),
 *   () => require('./Route')
 * )
 * ```
 */
export default function resolveAsyncRoute(
  codeSplitted: CodeSplittedFn,
  syncRequire: SyncRequireFn
): AsyncOrSyncRouteConfig {
  if (typeof codeSplitted !== 'function') {
    throw new TypeError(
      'The first argument of resolveAsyncRoute() must be a function returning an import()-promise'
    );
  }

  if (typeof syncRequire !== 'function') {
    throw new TypeError(
      'The second argument to resovleAsyncRoute() must be a function returning require()'
    );
  }

  if (__DEV__) {
    let component = syncRequire();
    if (component && component.__esModule) {
      component = component.default;
    }

    return {
      component
    };
  }

  return {
    getComponent(location, cb) {
      codeSplitted().then(loadRoute(cb)).catch(loadingError);
    }
  };
}
