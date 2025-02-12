import type { ComponentType } from 'react';

interface Config {
  resolveComponent?: (
    components: Record<string, ComponentType>,
  ) => ComponentType;
}

export const lazyComponent =
  (
    loader: () => Promise<{ default: ComponentType }>,
    { resolveComponent }: Config = {},
  ) =>
  () =>
    loader().then((module) => ({
      Component: resolveComponent ? resolveComponent(module) : module.default,
    }));
