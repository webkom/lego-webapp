// @flow

import React from 'react';
import Select from 'react-select';
import { createField } from './Field';
import style from 'SelectInput.css';
import withAutocomplete from '../Search/withAutocomplete';
import 'react-select/dist/react-select.css';

type Props = {
  name: string,
  placeholder?: string,
  multiple?: boolean,
  tags?: boolean,
  fetching: boolean,
  className?: string,
  selectStyle?: string,
  onBlur: (e: any) => void,
  onSearch: string => void,
  shouldKeyDownEventCreateNewOption: number => boolean,
  value: any,
  options?: {}[]
};

function SelectInput({
  name,
  fetching,
  selectStyle,
  onBlur,
  shouldKeyDownEventCreateNewOption,
  value,
  options = [],
  ...props
}: Props) {
  if (props.tags) {
    return (
      <div className={style.field}>
        <Select.Creatable
          {...props}
          instanceId={name}
          multi
          onBlurResetsInput={false}
          onBlur={() => onBlur(value)}
          value={value}
          options={options}
        />
      </div>
    );
  }
  return (
    <div className={style.field}>
      <Select
        {...props}
        instanceId={name}
        multi
        shouldKeyDownEventCreateNewOption={shouldKeyDownEventCreateNewOption}
        onBlurResetsInput={false}
        onBlur={() => onBlur(value)}
        value={value}
        options={options}
        isLoading={fetching}
        onInputChange={value => {
          if (props.onSearch) {
            props.onSearch(value);
          }
          return value;
        }}
      />
    </div>
  );
}

SelectInput.Field = createField(SelectInput);
SelectInput.AutocompleteField = withAutocomplete(SelectInput.Field);
SelectInput.withAutocomplete = withAutocomplete(SelectInput);
export default SelectInput;
