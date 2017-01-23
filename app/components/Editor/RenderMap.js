import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import { Block } from './constants';

export default Map({ // eslint-disable-line
  [Block.CAPTION]: {
    element: 'cite'
  },
  [Block.BLOCKQUOTE_CAPTION]: {
    element: 'blockquote'
  },
  [Block.TODO]: {
    element: 'div'
  },
  [Block.IMAGE]: {
    element: 'div'
  },
  [Block.BREAK]: {
    element: 'div'
  },
  [Block.ATOMIC]: {
    element: 'div'
  },
  [Block.EMBED]: {
    element: 'div'
  }
}).merge(DefaultDraftBlockRenderMap);
