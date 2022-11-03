import { mergeWith } from 'lodash';

function overrideArrays(
  oldValue,
  newValue
): Record<string, any> | null | undefined {
  if (Array.isArray(oldValue)) {
    return newValue;
  }
}
/**
 * Merges two objects, overriding old arrays with the new ones.
 */

export default function mergeObjects(
  old: Record<string, any>,
  updated: Record<string, any>
): Record<string, any> {
  return mergeWith({}, old, updated, overrideArrays);
}
