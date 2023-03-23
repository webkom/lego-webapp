import Select from 'react-select';
import Creatable from 'react-select/creatable';
import mazemapAutocomplete from '../Search/mazemapAutocomplete';
import withAutocomplete from '../Search/withAutocomplete';
import { createField } from './Field';
import style from './SelectInput.css';
import type { ChangeEvent, FocusEvent } from 'react';
import type { GroupBase, StylesConfig, ThemeConfig } from 'react-select';

type Props = {
  name: string;
  placeholder?: string;
  multiple?: boolean;
  tags?: boolean;
  fetching: boolean;
  className?: string;
  selectStyle?: StylesConfig<any, false, GroupBase<any>>;
  onBlur: (
    event: FocusEvent<HTMLInputElement>,
    newValue?: string,
    previousValue?: string,
    name?: string
  ) => void;
  onChange?: (
    event: ChangeEvent,
    newValue: string,
    previousValue: string
  ) => void;
  onSearch: (arg0: string) => void;
  shouldKeyDownEventCreateNewOption: (arg0: number) => boolean;
  isValidNewOption: (arg0: string) => boolean;
  value: any;
  disabled?: boolean;
  options?: Record<string, any>[];
};

export const selectStyles = {
  control: (styles: Record<string, any>) => ({ ...styles, cursor: 'pointer' }),
  option: (
    styles: Record<string, any>,
    {
      isDisabled,
      isSelected,
    }: {
      isDisabled: boolean;
      isSelected: boolean;
    }
  ) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    color: isSelected ? 'var(--color-gray-1)' : undefined,
  }),
};
export const selectTheme = (
  theme: ThemeConfig & { colors: Record<string, string> }
) => ({
  ...theme,
  colors: {
    ...theme.colors,
    //primary: 'var(--color-blue-4)', // Selected backgroundColor
    primary25: 'var(--color-select-hover)',
    // Hover backgroundColor
    //primary75:  // Unknown
    neutral0: 'var(--color-white)',
    // Background color
    //neutral5: // Unknown
    neutral10: 'var(--color-select-multi-bg)',
    // Multiselect item background
    // neutral20: // Border color
    // neutral30: // Hover border color
    // neutral40: // Unknown
    // neutral50: // Placholder font color,
    // neutral60: // Unknown
    // neutral70: // Unknown
    neutral80: 'var(--lego-font-color)', // Font color
    // neutral90: // Unknown
  },
});

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
        styles={selectStyle ?? selectStyles}
        theme={selectTheme}
        blurInputOnSelect={false}
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
