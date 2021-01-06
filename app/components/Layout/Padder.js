// @flow

import type { Node } from 'react';

type Props = {
  left: number,
  right: number,
  top: number,
  bottom: number,
  children: Node,
};

function Padder({ left = 0, right = 0, top = 0, bottom = 0, children }: Props) {
  return (
    <div
      style={{
        paddingLeft: left,
        paddingRight: right,
        paddingTop: top,
        paddingBottom: bottom,
        flex: 1,
      }}
    >
      {children}
    </div>
  );
}

export default Padder;
