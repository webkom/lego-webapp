// @flow

import React from 'react';
import { createField } from './Field';
import TextInput from 'app/components/Form/TextInput';

function DatePicker(props: any) {
  return (
    <TextInput type='date' {...props} />
  );
}

DatePicker.Field = createField(DatePicker);

export default DatePicker;
