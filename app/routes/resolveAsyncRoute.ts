type ComponentFn = () => Promise<Record<string, any>>;
type AsyncOrSyncRouteConfig =
  | {
      getComponent: (
        location: string,
        cb: (
          arg0: Record<string, any> | null,
          arg1: Record<string, any> | null | undefined
        ) => void
      ) => void;
    }
  | {
      component: Record<string, any>;
    };
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

  return {
    getComponent(
      location,
      callback: (
        error: Record<string, any> | null,
        component?: Record<string, any>
      ) => void
    ) {
      let component = componentFn();

      // $FlowFixMe
      if (component && component.__esModule) {
        // $FlowFixMe
        component = (component as any).default;
      }

      if (!component.then) {
        callback(component);
        return;
      }

      component
        .then((module) => callback(null, module.default))
        .catch((error) => callback(error));
    },
  };
}
