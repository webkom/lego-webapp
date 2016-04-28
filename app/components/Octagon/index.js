import './Octagon';
import React from 'react';

const Octagon = ({ size, children }) => {
  const style = { width: size, height: size };
  return (
    <div style={style} className='octagonWrapper'>
      <div style={style} className='octagon'>
        {children}
      </div>
    </div>
  );
};

export default Octagon;
