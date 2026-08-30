import type { StylesConfig } from 'react-select';

type Option = { label: string; value: unknown };

const WIN_FONT = 'Tahoma, "MS Sans Serif", Arial, sans-serif';
// Text/icon color on the control itself (a fixed white/light-grey box
// regardless of site theme) vs. inside the dark menu popup.
const WIN_TEXT_ON_LIGHT = '#000';
const WIN_TEXT_ON_DARK = '#fff';

// Win32-dialog-styled react-select, for use with SelectInput's `selectStyle`
// prop across the /sudo/achievements Control Panel pastiche.
export const win95SelectStyles: StylesConfig<Option, boolean> = {
  control: (base, { isDisabled }) => ({
    ...base,
    fontFamily: WIN_FONT,
    fontSize: '11px',
    borderRadius: 0,
    minHeight: '22px',
    background: isDisabled ? '#ece9d8' : '#fff',
    border: 'none',
    boxShadow:
      'inset -1px -1px 0 #fff, inset 1px 1px 0 #404040, inset -2px -2px 0 #dfdfdf, inset 2px 2px 0 #808080',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({ ...base, padding: '0 4px' }),
  // These three fall back to SelectInput's own theme prop (site font
  // color) unless pinned here - in dark mode that's a light color, which
  // reads as washed-out grey against this control's fixed white background.
  singleValue: (base) => ({ ...base, color: WIN_TEXT_ON_LIGHT }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: WIN_TEXT_ON_LIGHT,
  }),
  placeholder: (base) => ({ ...base, color: '#404040' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '2px 4px',
    color: WIN_TEXT_ON_LIGHT,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    fontFamily: WIN_FONT,
    fontSize: '11px',
    background: '#000a3d',
    border: '1px solid #000',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    borderRadius: 0,
    background: isSelected ? '#3a78e7' : isFocused ? '#1c3f8f' : 'transparent',
    color: WIN_TEXT_ON_DARK,
    cursor: 'pointer',
  }),
  noOptionsMessage: (base) => ({ ...base, color: WIN_TEXT_ON_DARK }),
  loadingMessage: (base) => ({ ...base, color: WIN_TEXT_ON_DARK }),
  multiValue: (base) => ({
    ...base,
    borderRadius: 0,
    background: '#000080',
  }),
  multiValueLabel: (base) => ({ ...base, color: WIN_TEXT_ON_DARK }),
  multiValueRemove: (base) => ({
    ...base,
    color: WIN_TEXT_ON_DARK,
    ':hover': { background: '#c00000', color: WIN_TEXT_ON_DARK },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 100 }),
};
