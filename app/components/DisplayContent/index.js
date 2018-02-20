//@flow

import React from 'react';
import Editor from 'app/components/Editor';

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

function DisplayContent({ content, id, style, className }: Props) {
  return (
    <div htmlId={id} style={style} className={className}>
      <Editor
        simple={false}
        autoFocus={false}
        placeholder=""
        onChange={() => {}}
        onBlur={() => {}}
        onFocus={() => {}}
        value={content}
        disabled
      />
    </div>
  );
}

export default DisplayContent;
