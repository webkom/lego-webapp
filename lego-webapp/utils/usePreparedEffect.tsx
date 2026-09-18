import { useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';

const useHydratedEffect = (effect: () => void, deps: unknown[]) => {
  const { isHydration } = usePageContext();
  useEffect(() => {
    if (isHydration) return;
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * TEMPORARY
 *
 * This is intended as a inplace replacement for the usePreparedEffect hook
 * from react-prepare and is only intended to be used for a smooth migration
 * experience.
 *
 * @param _ - not used
 * @param effect - function to run after hydration
 * @param deps - dependencies for the effect
 */
export const usePreparedEffect = (
  _: string,
  effect: () => void,
  deps: unknown[],
) => useHydratedEffect(effect, deps);

export default usePreparedEffect;
