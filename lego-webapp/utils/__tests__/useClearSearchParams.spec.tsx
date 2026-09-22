import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import {
  RouterContext,
  useClearSearchParams,
} from '../../../packages/lego-bricks/src/RouterContext';
import type { RouterContextData } from '../../../packages/lego-bricks/src/RouterContext';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routerValue: RouterContextData = {
  navigate: () => {},
  useLocation: () => ({ pathname: '/users/me/settings', search: '' }),
};

describe('useClearSearchParams', () => {
  it('returns a referentially stable callback across re-renders', async () => {
    const seen: (() => void)[] = [];
    let forceRender = () => {};

    const Probe = () => {
      const [, setTick] = useState(0);
      forceRender = () => setTick((tick) => tick + 1);
      seen.push(useClearSearchParams());
      return null;
    };

    const root = createRoot(document.createElement('div'));
    await act(async () => {
      root.render(
        <RouterContext.Provider value={routerValue}>
          <Probe />
        </RouterContext.Provider>,
      );
    });
    await act(async () => {
      forceRender();
    });

    expect(seen.length).toBeGreaterThanOrEqual(2);
    expect(seen.at(-1)).toBe(seen[0]);

    await act(async () => {
      root.unmount();
    });
  });
});
