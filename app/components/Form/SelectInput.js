// @flow

import React from 'react';
import Select from 'react-select';
import { createField } from './Field';
import withAutocomplete from '../Search/withAutocomplete';
import styles from './SelectInput.css';

type Props = {
  name: string,
  placeholder?: string,
  multiple?: boolean,
  tags?: boolean,
  fetching: boolean,
  className?: string,
  onBlur: (e: any) => void,
  onSearch: (string) => void,
  shouldKeyDownEventCreateNewOption: (number) => boolean,
  isValidNewOption: (string) => boolean,
  value: any,
  isDisabled?: boolean,
  options?: {}[],
};

function SelectInput({
  name,
  fetching,
  onBlur,
  shouldKeyDownEventCreateNewOption,
  isValidNewOption,
  value,
  options = [],
  isDisabled = false,
  placeholder,
  ...props
}: Props) {
  if (props.tags) {
    return (
      <div className={styles.field}>
        <Select.Creatable
          {...props}
          isDisabled={isDisabled}
          placeholder={!isDisabled && placeholder}
          instanceId={name}
          isMulti
          onBlur={() => onBlur(value)}
          value={value}
          isValidNewOption={isValidNewOption}
          shouldKeyDownEventCreateNewOption={shouldKeyDownEventCreateNewOption}
          options={options}
          isLoading={fetching}
          onInputChange={(value) => {
            if (props.onSearch) {
              props.onSearch(value);
            }
            return value;
          }}
          className={styles.select}
        />
      </div>
    );
  }
  return (
    <div className={styles.field}>
      <Select
        {...props}
        isDisabled={isDisabled}
        placeholder={isDisabled ? 'Tomt' : placeholder}
        instanceId={name}
        shouldKeyDownEventCreateNewOption={shouldKeyDownEventCreateNewOption}
        onBlur={() => onBlur(value)}
        value={value}
        options={options}
        isLoading={fetching}
        onInputChange={(value) => {
          if (props.onSearch) {
            props.onSearch(value);
          }
          return value;
        }}
        className={styles.select}
      />
    </div>
  );
}

SelectInput.Field = createField(SelectInput);
SelectInput.AutocompleteField = withAutocomplete({
  WrappedComponent: SelectInput.Field,
});
SelectInput.WithAutocomplete = withAutocomplete({
  WrappedComponent: SelectInput,
});
export default SelectInput;
