/* eslint-disable consistent-return */
import { Inline } from '../constants';

const onKeyDown = (e, data, state) => {
  if (!data.isMod) {
    return;
  }
  let mark;

  switch (data.key) {
    case 'b':
      mark = Inline.Bold;
      break;
    case 'i':
      mark = Inline.Italic;
      break;
    case 'u':
      mark = Inline.Underline;
      break;
    default:
      return;
  }

  state = state.transform().toggleMark(mark).apply();

  e.preventDefault();
  return state;
};

export default { onKeyDown };
