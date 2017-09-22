// @flow

import React from 'react';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

type Props = {
  /** Markdown content that will be rendered */
  children: string
};

function Markdown({ children, ...rest }: Props) {
  if (typeof children !== 'string') {
    throw new Error('<Markdown /> expects its child to be a string.');
  }
  return <div {...rest} dangerouslySetInnerHTML={{ __html: marked(children) }} />;
}

export default Markdown;
