import { Blocks } from './constants';

export const insertParagraph = (state) => state
    .transform()
    .moveToOffsets(0, 0)
    .splitBlock()
    .setBlock({
      type: Blocks.Paragraph,
      isVoid: false,
      data: {}
    })
    .extendForward(1)
    .delete()
    .apply({
      save: false
    });
