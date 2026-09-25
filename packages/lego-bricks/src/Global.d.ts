import type { IonIcon } from './components/Icon/IonIcons';
import type * as React from 'react';
import type { DOMAttributes, ReactNode } from 'react';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: ReactNode }>;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ['ion-icon']: CustomElement<IonIcon>;
    }
  }
}

declare module 'react-tiny-popover' {
  namespace JSX {
    interface Element extends React.JSX.Element {}
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
