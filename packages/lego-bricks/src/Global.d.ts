import type { IonIcon } from './components/Icon/IonIcons';
import type { DOMAttributes, ReactNode } from 'react';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: ReactNode }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['ion-icon']: CustomElement<IonIcon>;
    }
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
