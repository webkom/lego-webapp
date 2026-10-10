import type LegoCropperElements from './components/Cropper/Cropper';
import type { DOMAttributes, ReactNode } from 'react';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: ReactNode }>;

declare module 'react' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends LegoCropperElements {}
  }
}

declare module 'react-tiny-popover' {
  namespace JSX {
    type Element = React.JSX.Element;
  }
}

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: {
      keepScrollPosition?: boolean;
      overwriteLastHistoryEntry?: boolean;
      navigationState?: unknown;
    };
  }
}
