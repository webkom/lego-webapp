
import { mergeWith } from 'lodash';

function overrideArrays(oldValue, newValue): ?Object {
  if (Array.isArray(oldValue)) {
    return newValue;
  }
}

/**
 * Merges two objects, overriding old arrays with the new ones.
 */
export default function mergeObjects(old: Object, updated: Object): Object {
  return mergeWith({}, old, updated, overrideArrays);
}
