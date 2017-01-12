
import { getDefaultKeyBinding } from 'draft-js';

/*
Emits various key commands to be used by `handleKeyCommand` in `Editor` based
on various key combos.
*/
export default function keyBindings(e) {
  return getDefaultKeyBinding(e);
}
