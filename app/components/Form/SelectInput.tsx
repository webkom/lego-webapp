import Select from 'react-select';
import Creatable from 'react-select/creatable';
import withMazemapAutocomplete from '../Search/mazemapAutocomplete';
import withAutocomplete from '../Search/withAutocomplete';
import { createField } from './Field';
import style from './SelectInput.css';
import type { ChangeEvent, FocusEvent } from 'react';
import type { StylesConfig, ThemeConfig } from 'react-select';

type Props<Option, IsMulti extends boolean = false> = {
  name: string;
  label: string;
  placeholder?: string;
  tags?: boolean;
  fetching: boolean;
  className?: string;
  selectStyle?: StylesConfig<Option, IsMulti>;
  onBlur: (
    event: FocusEvent<HTMLInputElement>,
    newValue?: string,
    previousValue?: string,
    name?: string,
  ) => void;
  onChange?: (event: ChangeEvent | string) => void;
  onSearch: (search: string) => void;
  isValidNewOption: (arg0: string) => boolean;
  value: any;
  disabled?: boolean;
  options?: Option[];
  creatable?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
};

export const selectStyles: StylesConfig = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    cursor: 'pointer',
    opacity: isDisabled ? '0.5' : 1,
    backgroundColor: isDisabled && undefined,
    border: '1.5px solid var(--border-gray)',
    borderRadius: 'var(--border-radius-md)',
    fontSize: '14px',
  }),
  option: (styles, { isDisabled, isSelected }) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    color: isSelected ? 'var(--color-gray-1)' : undefined,
    fontSize: '14px',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 20 }),
};
export const selectTheme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'var(--color-gray-4)', // Primary color
    // primary75: // Unknown
    primary50: 'var(--color-gray-3)', // Focused item background color
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
    dangerLight: 'rgba(255, 0, 0, var(--low-alpha))', // Background color of delete button in multi select items
  },
});

const NO_OPTIONS_MESSAGE = 'Ingen treff';
const LOADING_MESSAGE = 'Laster inn ...';

const SelectInput = <Option, IsMulti extends boolean = false>({
  name,
  label,
  fetching,
  selectStyle,
  onBlur = () => {},
  isValidNewOption,
  value,
  options = [],
  disabled = false,
  placeholder,
  creatable,
  onSearch,
  ...props
}: Props<Option, IsMulti>) => {
  if (props.tags) {
    creatable = true;
    props.isMulti = true;
  }

  const defaultPlaceholder = label ? `Velg ${label.toLowerCase()}` : 'Velg ...';

  if (creatable) {
    return (
      <div className={style.field}>
        <Creatable
          {...props}
          isDisabled={disabled}
          placeholder={!disabled && (placeholder || defaultPlaceholder)}
          instanceId={name}
          isMulti={props.isMulti}
          onBlur={() => onBlur(value)}
          value={value}
          isValidNewOption={isValidNewOption}
          options={options}
          isLoading={fetching}
          styles={selectStyle ?? selectStyles}
          theme={selectTheme}
          onInputChange={(value) => {
            onSearch?.(value);
            return value;
          }}
          loadingMessage={() => LOADING_MESSAGE}
          noOptionsMessage={() => NO_OPTIONS_MESSAGE}
        />
      </div>
    );
  }

  return (
    <div className={style.field}>
      <Select
        {...props}
        isDisabled={disabled}
        placeholder={disabled ? 'Tomt' : placeholder || defaultPlaceholder}
        instanceId={name}
        onBlur={() => onBlur(value)}
        value={value}
        options={options}
        isLoading={fetching}
        onInputChange={(value) => {
          onSearch?.(value);
          return value;
        }}
        menuPortalTarget={document.body}
        styles={selectStyle ?? selectStyles}
        theme={selectTheme}
        blurInputOnSelect={false}
        loadingMessage={() => LOADING_MESSAGE}
        noOptionsMessage={() => NO_OPTIONS_MESSAGE}
      />
    </div>
  );
};

SelectInput.Field = createField(SelectInput);
SelectInput.AutocompleteField = withAutocomplete({
  WrappedComponent: SelectInput.Field,
});
SelectInput.WithAutocomplete = withAutocomplete({
  WrappedComponent: SelectInput,
});
SelectInput.MazemapAutocomplete = withMazemapAutocomplete({
  WrappedComponent: SelectInput.Field,
});
export default SelectInput;
