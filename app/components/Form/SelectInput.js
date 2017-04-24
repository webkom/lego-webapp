// @flow

import React from 'react';
import Select, { Creatable } from 'react-select';
import { createField } from './Field';
import style from './SelectInput.css';
import 'react-select/dist/react-select.css';

type Props = {
  placeholder?: string,
  value?: SelectValue,
  multiple?: boolean,
  tags?: boolean,
  options?: {}[]
};

function render(selectProps) {
  return <Creatable {...selectProps} />;
}

function SelectInput({ options = [], ...props }: Props) {
  if (props.tags) {
    return (
      <div className={style.field}>
        <Select.Creatable
          {...props}
          {...props.input}
          {...props.meta}
          multi
          options={options}
        />
      </div>
    );
  }

  return (
    <div className={style.field}>
      <Select
        {...props}
        {...props.input}
        {...props.meta}
        options={options}
        render={render}
      />
    </div>
  );
}

SelectInput.Field = createField(SelectInput);
export default SelectInput;
