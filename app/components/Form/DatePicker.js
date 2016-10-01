// @flow

import React from 'react';
import TextInput from 'app/components/Form/TextInput';

function DatePicker(props: any) {
  return (
    <TextInput type='date' {...props} />
  );
}

export default DatePicker;
