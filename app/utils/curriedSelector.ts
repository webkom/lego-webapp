import { createSelector } from 'reselect';
import type { RootState } from 'app/store/createRootReducer';
import type { SelectorArray, UnknownMemoizer, weakMapMemoize } from 'reselect';

/**
 * Utils for created curried selectors with reselect
 * Changes (state, args) => result to (args) => (state) => result
 * Makes it cleaner to use in useAppSelector
 *
 * Code taken mostly from https://reselect.js.org/FAQ#how-can-i-make-a-curried-selector
 */

export const currySelector = <
  State,
  Result,
  Params extends readonly unknown[],
  AdditionalFields,
>(
  selector: ((state: State, ...args: Params) => Result) & AdditionalFields,
) => {
  const curriedSelector = (...args: Params) => {
    return (state: State) => {
      return selector(state, ...args);
    };
  };
  return Object.assign(curriedSelector, selector);
};

export const createAppSelector = createSelector.withTypes<RootState>();

export const createCurriedSelector = <
  InputSelectors extends SelectorArray<RootState>,
  Result,
  OverrideMemoizeFunction extends UnknownMemoizer = typeof weakMapMemoize,
  OverrideArgsMemoizeFunction extends UnknownMemoizer = typeof weakMapMemoize,
>(
  ...args: Parameters<
    typeof createAppSelector<
      InputSelectors,
      Result,
      OverrideMemoizeFunction,
      OverrideArgsMemoizeFunction
    >
  >
) => {
  return currySelector(createAppSelector(...args));
};
