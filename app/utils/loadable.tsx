import { LoadingPage } from '@webkom/lego-bricks';
import { Suspense } from 'react';
import { lazy } from 'vite-preload';
import type { ComponentType } from 'react';

export const loadable = <P,>(
  factory: Parameters<typeof lazy<ComponentType<P>>>[0],
): ComponentType<P> =>
  function LoadableComponent(props) {
    const Component = lazy(() => {
      console.log('loading');
      return factory();
    });
    return (
      <Suspense fallback={<LoadingPage loading />}>
        <Component {...props} />
      </Suspense>
    );
  };
