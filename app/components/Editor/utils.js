import React from 'react';
import { Inline, Blocks } from './constants';
import { Break, Image } from './Blocks';
import Plugins from './Plugins';

export const insertParagraph = state =>
  state
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

export const getPlugins = blocksEnabled => {
  let plugins = [...Plugins.base];
  if (blocksEnabled) {
    plugins = plugins.concat(Plugins.blocks);
  }
  return plugins;
};

export const getSchema = blocksEnabled => {
  const schema = {
    marks: {
      [Inline.Bold]: props => <strong>{props.children}</strong>,
      [Inline.Code]: props => <code>{props.children}</code>,
      [Inline.Italic]: props => <em>{props.children}</em>,
      [Inline.Underline]: props => <u>{props.children}</u>,
      [Inline.Striketrough]: props => <strike>{props.children}</strike>
    }
  };
  if (blocksEnabled) {
    schema.nodes = {
      [Blocks.Break]: Break,
      [Blocks.Image]: Image,
      [Blocks.Blockquote]: props => <blockquote {...props.attributes}>{props.children}</blockquote>,
      [Blocks.Cite]: props => <cite {...props.attributes}>{props.children}</cite>,
      [Blocks.UL]: props => <ul {...props.attributes}>{props.children}</ul>,
      [Blocks.H1]: props => <h1 {...props.attributes}>{props.children}</h1>,
      [Blocks.H2]: props => <h2 {...props.attributes}>{props.children}</h2>,
      [Blocks.LI]: props => <li {...props.attributes}>{props.children}</li>,
      [Blocks.OL]: props => <ol {...props.attributes}>{props.children}</ol>
    };
  }
  return schema;
};
