interface RouteModule {
  clientAction?: any;
  clientLoader?: any;
  ErrorBoundary?: any;
  HydrateFallback?: any;
  Layout?: any;
  default: any;
  handle?: any;
  links?: any;
  meta?: any;
  shouldRevalidate?: any;
}

/**
 * Convert a route module to a route object. Temporary until all routes are converted to the new format, and we can use
 * React Router v7 framework.
 * https://reactrouter.com/upgrading/router-provider#1-move-route-definitions-into-route-modules
 */
export function convert(m: RouteModule) {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}
