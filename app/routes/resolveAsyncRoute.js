// @flow

function loadRoute(callback) {
  return module => callback(null, module.default);
}

function loadingError(err) {
  console.error('Loading error', err); // eslint-disable-line
}

type ComponentFn = () => Promise<Object> | Object;
type AsyncOrSyncRouteConfig =
  | {
      getComponent: (location: string, cb: () => void) => void
    }
  | { component: Object };

/**
 * Utility function for creating React-Router 3 config for async routes using
 * import()-statements but transforming these imports to require using babel
 * in development for better hot-reloadability.
 *
 * The function requires an import function that can be called at appropriate times.
 * We can not simply pass in the path as a string as webpack don't fully support
 * expressions inside these statements to make them statically analyzable.
 *
 *
 * It should be used as follows:
 * ```js
 * resolveAsyncRoute(
 *   () => import('./Route'),
 * )
 * ```
 */
export default function resolveAsyncRoute(
  componentFn: ComponentFn
): AsyncOrSyncRouteConfig {
  if (typeof componentFn !== 'function') {
    throw new TypeError(
      'The first argument of resolveAsyncRoute() must be a function returning an import()-promise'
    );
  }

  if (__DEV__) {
    let component = componentFn();
    if (component && component.__esModule) {
      component = component.default;
    }

    return {
      component
    };
  }

  return {
    getComponent(location, cb: (null, Object) => void) {
      componentFn()
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  };
}
