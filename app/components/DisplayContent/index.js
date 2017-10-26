//@flow

import React from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';

type Props = {
  /** The content to be displayed - the text */
  content: string,
  /** The id of the div wrapping the content - the id */
  id?: string,
  /** The classname of the div wrapping the content - the className */
  className?: string,
  /** Any style tp be added to the div wrapping the content - the style */
  style?: Object
};

const legalTags = [
  'p',
  'b',
  'i',
  'u',
  'h1',
  'h2',
  'code',
  'pre',
  'blockquote',
  'strong',
  'strike',
  'ul',
  'cite',
  'li',
  'em',
  'hr',
  'img',
  'div',
  'a',
  'text',
  undefined // Nodes with only text
];

const isValidNode = node => legalTags.includes(node.name);

const parser = new Parser();
const processNodeDefinitions = new ProcessNodeDefinitions(React);
const processingInstructions = [
  {
    // Custom <href> processing
    //
    shouldProcessNode: node => {
      return node.parent && node.parent.name && node.parent.name === 'href';
    },
    processNode: (node, children) => {
      return node.data.toUpperCase();
    }
  },
  {
    shouldProcessNode: node => {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode
  }
];

/**
* A basic tag component for displaying tags
*/
function DisplayContent({ content, id, style, className }: Props) {
  const react = parser.parseWithInstructions(
    content,
    isValidNode,
    processingInstructions
  );

  return (
    <div className={className} id={className} style={style}>
      {react}
    </div>
  );
}

export default DisplayContent;
