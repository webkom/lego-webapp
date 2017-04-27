// @flow

import React from 'react';
import Select, { Creatable } from 'react-select';
import { createField } from './Field';
import style from './SelectInput.css';
import 'react-select/dist/react-select.css';

type Props = {
  placeholder?: string,
  multiple?: boolean,
  tags?: boolean,
  fetching: boolean,
  options?: {}[]
};

function SelectInput({ fetching, options = [], ...props }: Props) {
  if (props.tags) {
    return (
      <div className={style.field}>
        <Select.Creatable
          {...props}
          multi
          onBlurResetsInput={false}
          onBlur={() => props.onBlur(props.value)}
          options={options}
        />
      </div>
    );
  }
  return (
    <div className={style.field}>
      <Select
        {...props}
        options={options}
        onBlurResetsInput={false}
        onBlur={null}
        simpleValue
        isLoading={fetching}
        onInputChange={value => {
          if (props.onSearch) {
            props.onSearch(value);
          }
          return value;
        }}
        render={props => <Creatable {...props} />}
      />
    </div>
  );
}

SelectInput.Field = createField(SelectInput);
export default SelectInput;
