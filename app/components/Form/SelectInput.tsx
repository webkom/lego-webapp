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
  control: (
    styles: Record<string, any>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...styles,
    cursor: 'pointer',
    opacity: isDisabled ? '0.5' : 1,
    backgroundColor: isDisabled && undefined,
    border: '1.5px solid var(--border-gray)',
    borderRadius: 'var(--border-radius-md)',
    fontSize: '14px',
  }),
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
    fontSize: '14px',
  }),
};
export const selectTheme = (
  theme: ThemeConfig & { colors: Record<string, string> }
) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'var(--color-gray-4)', // Primary color
    // primary75: // Unknown
    // primary50: // Unknown
    primary25: 'var(--additive-background)', // Hover background color
    neutral0: 'var(--lego-card-color)', // Background color
    // netutral5: // Unknown
    neutral10: 'var(--additive-background)', // Multi select item background
    neutral20: 'var(--border-gray)', // Border color
    neutral30: 'var(--border-gray)', // Hover border color
    neutral40: 'var(--secondary-font-color)', //  Text color in dropdown ("No options" and "Loading...")
    neutral50: 'var(--color-gray-5)', // Placholder color,
    neutral60: 'var(--color-gray-4)', // Focused arrow color
    // neutral70: // Unknown
    neutral80: 'var(--lego-font-color)', // Font color and hover arrow color
    // neutral90: // Unknown
    danger: 'var(--danger-color)', // Color of delete button in multi select items
    dangerLight: 'rgba(255, 0, 0, var(--color-red-hover-alpha))', // Background color of delete button in multi select items
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
          styles={selectStyle ?? selectStyles}
          theme={selectTheme}
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
