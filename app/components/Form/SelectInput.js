// @flow

import Select from 'react-select';
import Creatable from 'react-select/creatable';
import { createField } from './Field';
import withAutocomplete from '../Search/withAutocomplete';
import mazemapAutocomplete from '../Search/mazemapAutocomplete';
import style from './SelectInput.css';

type Props = {
  name: string,
  placeholder?: string,
  multiple?: boolean,
  tags?: boolean,
  fetching: boolean,
  className?: string,
  selectStyle?: string,
  onBlur: (e: any) => void,
  onSearch: (string) => void,
  shouldKeyDownEventCreateNewOption: (number) => boolean,
  isValidNewOption: (string) => boolean,
  value: any,
  disabled?: boolean,
  options?: {}[],
};

function SelectInput({
  name,
  fetching,
  selectStyle,
  onBlur,
  shouldKeyDownEventCreateNewOption,
  isValidNewOption,
  value,
  options = [],
  disabled = false,
  placeholder,
  ...props
}: Props) {
  if (props.tags) {
    return (
      <div className={style.field}>
        <Creatable
          {...props}
          isDisabled={disabled}
          placeholder={!disabled && placeholder}
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
        />
      </div>
    );
  }
  return (
    <div className={style.field}>
      <Select
        {...props}
        isDisabled={disabled}
        placeholder={disabled ? 'Tomt' : placeholder}
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
SelectInput.MazemapAutocomplete = mazemapAutocomplete({
  WrappedComponent: SelectInput.Field,
});
export default SelectInput;
