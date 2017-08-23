// @flow

import React from 'react';
import Select, { Creatable } from 'react-select';
import { createField } from './Field';
import 'react-select/dist/react-select.css';

type Props = {
  placeholder?: string,
  multiple?: boolean,
  meta?: any,
  tags?: boolean,
  fetching: boolean,
  className?: string,
  selectStyle?: string,
  onBlur: () => void,
  value: any,
  options?: {}[]
};

function SelectInput({
  fetching,
  meta,
  selectStyle,
  onBlur,
  value,
  options = [],
  ...props
}: Props) {
  if (props.tags) {
    return (
      <Select.Creatable
        {...props}
        multi
        onBlurResetsInput={false}
        onBlur={() => onBlur(value)}
        value={value}
        options={options}
      />
    );
  }
  return (
    <Select
      {...props}
      style={selectStyle}
      options={options}
      value={value}
      onBlurResetsInput={false}
      onBlur={() => onBlur(value)}
      isLoading={meta && meta.active && fetching}
      onInputChange={value => {
        if (props.onSearch) {
          props.onSearch(value);
        }
        return value;
      }}
      render={props => <Creatable {...props} />}
    />
  );
}

SelectInput.Field = createField(SelectInput);
export default SelectInput;
