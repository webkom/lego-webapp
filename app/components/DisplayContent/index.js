//@flow

import React from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';

type Props = {
  /** The content to be displayed - the text */
  content: string,
  /** The content to be displayed - the text */
  id?: string,
  /** The content to be displayed - the text */
  className?: string,
  /** The content to be displayed - the text */
  style?: Object
};

const isValidNode = () => true;
const parser = new Parser();
const processNodeDefinitions = new ProcessNodeDefinitions(React);
const processingInstructions = [
  {
    // Custom <href> processing
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
