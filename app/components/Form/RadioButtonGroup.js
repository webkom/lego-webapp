import React from 'react';

const RadioButtonGroup = ({ name, label, children }) => {
  return (
    <div>
      <p>{label}</p>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          name,
          fieldStyle: {
            display: 'inline-flex',
            marginRight: '10px',
            width: 'auto'
          }
        })
      )}
    </div>
  );
};

export default RadioButtonGroup;
