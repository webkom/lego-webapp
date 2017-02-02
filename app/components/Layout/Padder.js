import React from 'react';

function Padder({ left = 0, right = 0, top = 0, bottom = 0, children }) {
  return (
    <div
      style={{
        paddingLeft: left,
        paddingRight: right,
        paddingTop: top,
        paddingBottom: bottom,
        flex: 1
      }}
    >
      {children}
    </div>
  );
}

export default Padder;
