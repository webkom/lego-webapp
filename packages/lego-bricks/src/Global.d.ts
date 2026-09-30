export {};

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: {
      keepScrollPosition?: boolean;
      overwriteLastHistoryEntry?: boolean;
      navigationState?: unknown;
    };
  }
}
