// @flow

import React from 'react';
import Select, { Option } from 'rc-select';
import { createField } from './Field';
import 'rc-select/assets/index.css';
import styles from './SelectInput.css';

type Props = {
  notFound?: React.ReactNode | string | null,
  placeholder?: string,
  value?: SelectValue,
  defaultValue?: SelectValue,
  multiple?: boolean,
  tags?: boolean,
  defaultActiveFirstOption?: boolean,
  labelInValue?: boolean,
  options?: string[]
};

function SelectInput({ notFound = 'Not Found', options = [], ...props }: Props) {
  return (
    <Select
      {...props}
      {...props.input}
      {...props.meta}
      className='lego-select'
      placeholder={<span>Select option</span>}
      dropdownClassName={styles.dropdown}
      notFoundContent={notFound}
    >
      {options.map((option) => <Option className={styles.dropdown} value={option}>option</Option>)}
    </Select>
  );
}

SelectInput.Field = createField(SelectInput);
export default SelectInput;
